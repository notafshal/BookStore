<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class AdminReportController extends Controller
{
    public function dashboard()
    {
        $totalRevenue = DB::table('orders')
            ->where('status', 'completed')
            ->sum('total_price');

        $totalOrders = DB::table('orders')->count();

        // Sales per month
        $salesByMonth = DB::table('orders')
            ->select(
                DB::raw('MONTH(created_at) as month'),
                DB::raw('SUM(total_price) as total')
            )
            ->where('status', 'completed')
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        // Top selling books
        $topBooks = DB::table('order_items')
            ->join('books', 'order_items.book_id', '=', 'books.id')
            ->select(
                'books.title',
                DB::raw('SUM(order_items.quantity) as sold')
            )
            ->groupBy('books.title')
            ->orderByDesc('sold')
            ->limit(5)
            ->get();

        return response()->json([
            'totalRevenue' => $totalRevenue,
            'totalOrders' => $totalOrders,
            'salesByMonth' => $salesByMonth,
            'topBooks' => $topBooks
        ]);
    }
}
