<?php

use App\Http\Controllers\API\AdminOrderController;
use App\Http\Controllers\API\AdminReportController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\BookSearchController;
use App\Http\Controllers\API\ReviewController;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\CartController;
use App\Http\Controllers\BookController;


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/books/search', [BookSearchController::class, 'index']);
Route::get('/books', [BookController::class, 'index']);
Route::get('/books/reviews', [ReviewController::class, 'allReviews']);
Route::get('/books/{book}', [BookController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {
 Route::put('/reviews/{id}', [ReviewController::class, 'update']);
    Route::delete('/reviews/{id}', [ReviewController::class, 'destroy']);
    Route::post('/books/{book_id}/reviews', [ReviewController::class, 'store']);

    Route::get('/cart', [CartController::class, 'index']);
    Route::post('/cart', [CartController::class, 'store']);
    Route::delete('/cart/{id}', [CartController::class, 'destroy']);
    Route::post('/checkout', [CartController::class, 'checkout']);

    Route::get('/orders/track/{order_id}', [UserController::class, 'trackOrder']);
    Route::get('/user/orders', [UserController::class, 'orders']);
    Route::post('/buy-now', [UserController::class, 'buyNow']);

    Route::get('/users', [UserController::class, 'index']);
    Route::get('/users/{id}', [UserController::class, 'show']);
    Route::put('/users/{id}', [UserController::class, 'update']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);
    Route::post('/logout', [AuthController::class, 'logout']);

   Route::post('/user/saved-books/{book_id}', [UserController::class, 'saveBook']);
    Route::delete('/user/saved-books/{book_id}', [UserController::class, 'deleteSavedBook']);
    Route::get('/user/saved-books', [UserController::class, 'savedBooks']);
    
});


Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::post('/books', [BookController::class, 'store']);
    Route::put('/books/{book}', [BookController::class, 'update']);
    Route::delete('/books/{book}', [BookController::class, 'destroy']);
 Route::get('/admin/reports/dashboard', [AdminReportController::class, 'dashboard']);
     Route::get('/admin/orders', [AdminOrderController::class, 'allOrders']);
    Route::put('/admin/orders/{id}/status', [AdminOrderController::class, 'updateStatus']);
    Route::delete('/admin/orders/{id}', [AdminOrderController::class, 'cancelOrder']);
});
