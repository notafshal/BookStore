<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Book;
use Illuminate\Http\Request;

class BookSearchController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = Book::query();

            if ($request->filled('title')) {
                $query->where('title', 'like', "%{$request->title}%");
            }
            if ($request->filled('author')) {
                $query->where('author', 'like', "%{$request->author}%");
            }
            if ($request->filled('category')) {
                $query->where('category', $request->category);
            }
            if ($request->filled('min_price')) {
                $query->where('price', '>=', $request->min_price);
            }
            if ($request->filled('max_price')) {
                $query->where('price', '<=', $request->max_price);
            }
          if ($request->boolean('in_stock')) {
    $query->where('stock', '>', 0);
}


            return response()->json($query->get());
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error occurred',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
