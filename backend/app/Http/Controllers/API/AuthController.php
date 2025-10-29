<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6',
            'landmark' => 'nullable|string|max:150',
            'location' => 'nullable|string|max:150',
            'number' => 'nullable|string|max:20',
             'role' => 'nullable | in:customer,admin',
        ]);

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'landmark' => $request->landmark,
            'location' => $request->location,
            'number'   => $request->number,
             'role' => $request->role ?? 'customer',
        ]);

        return response()->json([
            'message' => 'User registered successfully',
            'user' => $user
        ], 201);
    }

   
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
           return response()->json(['message' => 'Invalid credentials'], 401);
        }
 $token = $user->createToken('auth_token')->plainTextToken;
        return response()->json([
            'message' => 'Login successful',
            'user' => $user,
             'token' => $token,
             'token_type' => 'Bearer',
        ]);
    }

    public function logout(Request $request)
    {
         $request->user()->tokens()->delete();
        return response()->json(['message' => 'Logged out successfully']);
    }
}
