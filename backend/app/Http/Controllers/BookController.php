<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\Request;

class BookController extends Controller
{
   
    public function index()
    {
        return response()->json(Book::all());
    }

    
    public function store(Request $request)
    {
        $request->validate([
            'title'       => 'required|string|max:255',
            'author'      => 'required|string|max:255',
            'category'    => 'nullable|string|max:100',
            'description' => 'nullable|string',
            'price'       => 'nullable|numeric',
            'stock'       => 'nullable|integer',
            'cover_image' => 'nullable|string|max:255',
        ]);
    try {
        $book = Book::create($request->only([
            'title', 'author', 'category', 'description', 'price', 'stock', 'cover_image'
        ]));
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Book creation failed',
            'error' => $e->getMessage()
        ], 500);
    }

    return response()->json([
        'message' => 'Book registered successfully',
        'book' => $book
    ], 201);
    }



    
    public function show(Book $book)
    {
        return response()->json($book);
    }

    
    public function update(Request $request, Book $book)
    {
        $request->validate([
            'title'       => 'sometimes|required|string|max:255',
            'author'      => 'sometimes|required|string|max:255',
            'category'    => 'nullable|string|max:100',
            'description' => 'nullable|string',
            'price'       => 'nullable|numeric',
            'stock'       => 'nullable|integer',
            'cover_image' => 'nullable|string|max:255',
        ]);

        $book->update($request->only(['title', 'author', 'category', 'price', 'stock', 'cover_image']));

        return response()->json([
            'message' => 'Book updated successfully',
            'book'    => $book
        ]);
    }

    
    public function destroy(Book $book)
    {
        $book->delete();

        return response()->json([
            'message' => 'Book deleted successfully'
        ]);
    }
}
