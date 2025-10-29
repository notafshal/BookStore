<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'total_price',
        'status',
        'shipping_address',
        'payment_method',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }


    public function books()
    {
        return $this->belongsToMany(Book::class, 'order_items')
                     ->withPivot('quantity', 'price')
                     ->withTimestamps();
    }
}
