from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions, serializers
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Item, Swap, SwapMessage
from rest_framework.decorators import api_view, permission_classes
from rest_framework import generics
from django.db import models

# Create your views here.

class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = '__all__'
        read_only_fields = ['owner', 'created_at', 'status']

class ItemCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def calculate_points(self, condition):
        if condition == 'excellent': return 50
        if condition == 'good': return 30
        if condition == 'fair': return 10
        if condition == 'new': return 60
        if condition == 'like_new': return 45
        if condition == 'used': return 5
        if condition == 'vintage': return 40
        return 0

    def post(self, request):
        data = request.data.copy()
        condition = data.get('condition', '')
        data['points'] = self.calculate_points(condition)
        serializer = ItemSerializer(data=data)
        if serializer.is_valid():
            serializer.save(owner=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def my_items(request):
    items = Item.objects.filter(owner=request.user).order_by('-created_at')
    serializer = ItemSerializer(items, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([])  # No authentication required
def browse_items(request):
    items = Item.objects.all().order_by('-created_at')
    search = request.GET.get('search')
    category = request.GET.get('category')
    size = request.GET.get('size')
    condition = request.GET.get('condition')
    brand = request.GET.get('brand')

    if search:
        from django.db.models import Q
        items = items.filter(
            Q(title__icontains=search) |
            Q(description__icontains=search) |
            Q(brand__icontains=search) |
            Q(category__icontains=search) |
            Q(tags__icontains=search)
        )
    if category and category != 'All Categories':
        items = items.filter(category__iexact=category)
    if size:
        size_list = [s.strip() for s in size.split(',') if s.strip()]
        if size_list:
            items = items.filter(size__in=size_list)
    if condition:
        cond_list = [c.strip() for c in condition.split(',') if c.strip()]
        if cond_list:
            items = items.filter(condition__in=cond_list)
    if brand and brand != 'All Brands':
        items = items.filter(brand__iexact=brand)

    serializer = ItemSerializer(items, many=True)
    return Response(serializer.data)

class MyItemDetailView(generics.RetrieveAPIView):
    serializer_class = ItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Item.objects.filter(owner=self.request.user)

class PublicItemDetailView(generics.RetrieveAPIView):
    serializer_class = ItemSerializer
    queryset = Item.objects.all()
    permission_classes = []  # No authentication required

class SwapSerializer(serializers.ModelSerializer):
    proposer_item = ItemSerializer(read_only=True)
    receiver_item = ItemSerializer(read_only=True)
    class Meta:
        model = Swap
        fields = '__all__'

class AvailableItemsView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request):
        user = request.user
        # Items not in a pending/active swap as proposer or receiver
        active_swaps = Swap.objects.filter(
            models.Q(status__in=['pending', 'accepted', 'meetup_pending', 'awaiting_response']) &
            (models.Q(proposer_item=models.OuterRef('pk')) | models.Q(receiver_item=models.OuterRef('pk')))
        )
        items = Item.objects.filter(owner=user).annotate(
            in_swap=models.Exists(active_swaps)
        ).filter(in_swap=False)
        serializer = ItemSerializer(items, many=True)
        return Response(serializer.data)

class SwapMessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.CharField(source='sender.full_name', read_only=True)
    class Meta:
        model = SwapMessage
        fields = ['id', 'swap', 'sender', 'sender_name', 'content', 'created_at']

class SwapMessageListCreateView(generics.ListCreateAPIView):
    serializer_class = SwapMessageSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        swap_id = self.kwargs['swap_id']
        return SwapMessage.objects.filter(swap_id=swap_id).order_by('created_at')
    def perform_create(self, serializer):
        swap_id = self.kwargs['swap_id']
        serializer.save(sender=self.request.user, swap_id=swap_id)

# Update SwapListCreateView to include unread count
class SwapListCreateView(generics.ListCreateAPIView):
    serializer_class = SwapSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Swap.objects.filter(
            models.Q(proposer=user) | models.Q(receiver=user)
        ).order_by('-created_at')

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        unread_count = queryset.filter(receiver=request.user, is_read=False).count()
        response = super().list(request, *args, **kwargs)
        response.data = {
            'swaps': response.data,
            'unread_count': unread_count
        }
        return response

    def perform_create(self, serializer):
        # Set is_read=False for receiver
        serializer.save(proposer=self.request.user, is_read=False)

class SwapUpdateView(generics.UpdateAPIView):
    serializer_class = SwapSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Swap.objects.all()
    lookup_field = 'pk'
