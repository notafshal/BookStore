<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Book;
use Illuminate\Http\Request;

class CartController extends Controller
{
   
    public function store(Request $request)
    {
        $request->validate([
            'book_id' => 'required|exists:books,id',
            'quantity' => 'required|integer|min:1'
        ]);

        $cart = Cart::updateOrCreate(
            [
                'user_id' => $request->user()->id,
                'book_id' => $request->book_id,
            ],
            [
                'quantity' => $request->quantity,
            ]
        );

        return response()->json($cart, 201);
    }

    public function index(Request $request)
    {
        $items = Cart::with('book')
            ->where('user_id', $request->user()->id)
            ->get();

        return response()->json($items);
    }

  
    public function destroy($id)
    {
        $item = Cart::findOrFail($id);
        $item->delete();

        return response()->json(['message' => 'Item removed']);
    }

   public function checkout(Request $request)
{
    $user = $request->user();
    $cartItems = $user->cart()->with('book')->get();

    if ($cartItems->isEmpty()) {
        return response()->json(['message' => 'Your cart is empty'], 400);
    }

    $totalPrice = $cartItems->sum(fn($item) => $item->book->price * $item->quantity);

   
    $order = $user->orders()->create([
        'total_price' => $totalPrice,
        'status' => 'pending',
        'shipping_address' => $request->shipping_address ?? 'No address provided',
        'payment_method' => $request->payment_method ?? 'cash_on_delivery',
    ]);

   
    foreach ($cartItems as $item) {
        $order->books()->attach($item->book_id, [
            'quantity' => $item->quantity,
            'price' => $item->book->price,
        ]);
    }

   
    $user->cart()->delete();

    return response()->json([
        'message' => 'Order placed successfully',
        'order_id' => $order->id,
        'status' => $order->status,
        'total' => $order->total_price
    ]);
}

}
