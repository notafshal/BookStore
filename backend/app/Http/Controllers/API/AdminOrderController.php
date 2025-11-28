<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

class AdminOrderController extends Controller
{
    
    public function allOrders()
    {
        $orders = Order::with(['user', 'books'])->latest()->get();

        return response()->json($orders);
    }

    
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,on_delivery,delivered,cancelled',
        ]);

        $order = Order::find($id);
        if (!$order) return response()->json(['message' => 'Order not found'], 404);

        $order->status = $request->status;
        $order->save();

        return response()->json(['message' => 'Order status updated', 'order' => $order]);
    }

  
    public function cancelOrder($id)
    {
        $order = Order::find($id);
        if (!$order) return response()->json(['message' => 'Order not found'], 404);

        $order->status = 'cancelled';
        $order->save();

        return response()->json(['message' => 'Order cancelled', 'order' => $order]);
    }
}
