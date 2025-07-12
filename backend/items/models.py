from django.db import models

# Create your models here.

class Item(models.Model):
    CATEGORY_CHOICES = [
        ('tops', 'Tops'),
        ('bottoms', 'Bottoms'),
        ('dresses', 'Dresses'),
        ('jackets', 'Jackets'),
        ('knitwear', 'Knitwear'),
        ('shoes', 'Shoes'),
        ('accessories', 'Accessories'),
        ('bags', 'Bags'),
        ('activewear', 'Activewear'),
        ('formal', 'Formal'),
    ]
    CONDITION_CHOICES = [
        ('excellent', 'Excellent'),
        ('good', 'Good'),
        ('fair', 'Fair'),
        ('new', 'New'),
        ('like_new', 'Like New'),
        ('used', 'Used'),
        ('vintage', 'Vintage'),
    ]
    title = models.CharField(max_length=255)
    description = models.TextField()
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    brand = models.CharField(max_length=100, blank=True)
    size = models.CharField(max_length=50, blank=True)
    color = models.CharField(max_length=50, blank=True)
    condition = models.CharField(max_length=20, choices=CONDITION_CHOICES)
    tags = models.CharField(max_length=255, blank=True)
    photo = models.ImageField(upload_to='item_photos/', blank=True, null=True)
    owner = models.ForeignKey('signup.User', on_delete=models.CASCADE, related_name='items')
    status = models.CharField(max_length=20, default='pending')
    points = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Swap(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('declined', 'Declined'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
        ('meetup_pending', 'Pending Meetup'),
        ('awaiting_response', 'Awaiting Response'),
    ]
    proposer = models.ForeignKey('signup.User', on_delete=models.CASCADE, related_name='proposed_swaps')
    receiver = models.ForeignKey('signup.User', on_delete=models.CASCADE, related_name='received_swaps')
    proposer_item = models.ForeignKey(Item, on_delete=models.CASCADE, related_name='proposer_swaps')
    receiver_item = models.ForeignKey(Item, on_delete=models.CASCADE, related_name='receiver_swaps')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    is_read = models.BooleanField(default=False)  # For receiver notifications
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Swap: {self.proposer_item} <-> {self.receiver_item} ({self.status})"

class SwapMessage(models.Model):
    swap = models.ForeignKey(Swap, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey('signup.User', on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Message from {self.sender} in Swap {self.swap.id}"
