<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use App\Models\Book;
use App\Models\Order;

class UserController extends Controller
{
   
    public function index()
    {
        $users = User::all();
        return response()->json($users);
    }

  
    public function show($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        return response()->json($user);
    }

    public function update(Request $request, $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $request->validate([
            'name' => 'sometimes|string|max:100',
            'email' => 'sometimes|email|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:6',
            'number' => 'nullable|string|max:15',
            'location' => 'nullable|string|max:255',
            'landmark' => 'nullable|string|max:255',
            
        ]);

        $user->update([
            'name' => $request->name ?? $user->name,
            'email' => $request->email ?? $user->email,
            'password' => $request->filled('password') ? Hash::make($request->password) : $user->password,
            'number' => $request->number ?? $user->number,
            'location' => $request->location ?? $user->location,
            'landmark' => $request->landmark ?? $user->landmark,
        ]);

        return response()->json(['message' => 'User updated successfully', 'user' => $user]);
    }

    public function destroy($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $user->delete();

        return response()->json(['message' => 'User deleted successfully']);
    }

 public function saveBook($book_id, Request $request)
{
    $user = $request->user();
    $book = \App\Models\Book::find($book_id);

    if (!$book) {
        return response()->json(['message' => 'Book not found'], 404);
    }

    if ($user->savedBooks()->where('book_id', $book_id)->exists()) {
        return response()->json([
            'message' => 'Book already saved',
            'favourited' => true
        ]);
    }

    $user->savedBooks()->attach($book_id);

    return response()->json([
        'message' => 'Book saved successfully',
        'favourited' => true
    ], 201);
}

public function deleteSavedBook($book_id, Request $request)
{
    $user = $request->user();
    $book = \App\Models\Book::find($book_id);

    if (!$book) {
        return response()->json(['message' => 'Book not found'], 404);
    }

    if (!$user->savedBooks()->where('book_id', $book_id)->exists()) {
        return response()->json([
            'message' => 'Book is not in saved list',
            'favourited' => false
        ], 400);
    }

    $user->savedBooks()->detach($book_id);

    return response()->json([
        'message' => 'Book unsaved successfully',
        'favourited' => false
    ]);
}

public function savedBooks(Request $request)
{
    $user = $request->user();
    if (!$user) {
        return response()->json(['error' => 'User not authenticated'], 401);
    }

    $savedBooks = $user->savedBooks()->get();

    return response()->json([
        'saved_books' => $savedBooks
    ]);
}

public function buyNow(Request $request)
{
    $request->validate([
        'book_id' => 'required|exists:books,id',
        'quantity' => 'required|integer|min:1',
    ]);

    $book = Book::findOrFail($request->book_id);
    $user = $request->user();

    $order = Order::create([
        'user_id' => $user->id,
        'status' => 'pending',
        'payment_method' => 'cod',
    ]);

    $order->books()->attach($book->id, [
        'price' => $book->price,
        'quantity' => $request->quantity,
    ]);

    return response()->json([
        'message' => 'Order created successfully',
        'order_id' => $order->id,
    ]);
}


    public function orders(Request $request)
    {
        return response()->json($request->user()->orders);
    }
    
    public function trackOrder(Request $request, $order_id)
{
    $user = $request->user(); 

   $order = $user->orders()->with('books')->find($order_id);

    if (!$order) {
        return response()->json(['message' => 'Order not found'], 404);
    }

    return response()->json([
    'order_id' => $order->id,
    'status' => $order->status,
    'payment_method' => $order->payment_method,
    'items' => $order->books->map(function ($book) {
        return [
            'book_id' => $book->id,
            'title' => $book->title,
            'price' => $book->pivot->price,
            'quantity' => $book->pivot->quantity,
            'subtotal' => $book->pivot->price * $book->pivot->quantity,
        ];
    }),
    'total' => $order->books->sum(fn($book) => $book->pivot->price * $book->pivot->quantity),
    'created_at' => $order->created_at,
]);
}
}
