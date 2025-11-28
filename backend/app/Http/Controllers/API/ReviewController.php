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
        'rating' => 'required|integer|min:1|max:5',
        'comment' => 'nullable|string'
    ]);

    $book = Book::find($book_id);

    if (!$book) {
        return response()->json(['error' => 'Book not found'], 404);
    }

    $review = Review::create([
        'book_id' => $book->id,
        'user_id' => $request->user()->id, // ✅ secure
        'rating' => $request->rating,
        'comment' => $request->comment,
    ]);

    return response()->json([
        'message' => 'Review added successfully',
        'review' => $review
    ], 201); // ✅ correct status
}


 public function allReviews()
    {
        $reviews = Review::with(['book','user'])->latest()->get();

        $formatted = $reviews->map(function ($review) {
            return [
                'review_id' => $review->id,
                'book_id' => $review->book_id,
                'book_title' => $review->book->title ?? 'Unknown',
                'user_id' => $review->user_id,
                'user_name' => $review->user->name ?? 'Unknown',
                'rating' => $review->rating,
                'comment' => $review->comment,
                'created_at' => $review->created_at->toDateTimeString(),
            ];
        });

        return response()->json($formatted);
    }



    public function update(Request $request, $id)
{
    $review = Review::findOrFail($id);

    if ($review->user_id !== $request->user()->id) {
        return response()->json(['error' => 'Unauthorized'], 403);
    }

    $request->validate([
        'rating' => 'required|integer|min:1|max:5',
        'comment' => 'nullable|string'
    ]);

    $review->update($request->only('rating', 'comment'));

    return response()->json([
        'message' => 'Review updated successfully',
        'review' => $review
    ]);
}
public function destroy(Request $request, $id)
{
    $review = Review::findOrFail($id);

    if ($review->user_id !== $request->user()->id) {
        return response()->json(['error' => 'Unauthorized'], 403);
    }

    $review->delete();

    return response()->json([
        'message' => 'Review deleted successfully'
    ]);
}

}
