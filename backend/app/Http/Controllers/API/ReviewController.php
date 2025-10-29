<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    
    public function store(Request $request, $book_id)
    {
        $request->validate([
            'user_id'=> 'required|string|max:255',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string'
        ]);

        $book = Book::find($book_id);

         if (!$book) {
        return response()->json(['error' => 'Book not found'], 404);
    }
       try {
        $review = Review::create([
            'book_id' => $book->id,
            'user_id' => $request->user_id,
            'rating' => $request->rating,
            'comment' => $request->comment,
        ]);

        return response()->json([
            'message' => 'Review added successfully',
            'review' => $review
        ], 201);

    } catch (\Exception $e) {
        return response()->json([
            'error' => 'Failed to add review',
            'details' => $e->getMessage()
        ], 500);
    }
    }

    public function show($id)
    {
        $book = Book::with('reviews')->findOrFail($id);

        return response()->json($book);
    }
}
