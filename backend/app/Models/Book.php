<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    use HasFactory;

   
    protected $fillable = [
        'title',
        'author',
        'category',
        'description',
        'price',
        'stock', 
        'cover_image'
    ];

    public function reviews()
{
    return $this->hasMany(Review::class);
}
public function cartItems()
{
    return $this->hasMany(Cart::class);
}

}
