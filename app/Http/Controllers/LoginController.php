<?php

namespace App\Http\Controllers;

use App\Models\User;
use Exception;
use GuzzleHttp\Exception\ClientException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\InvalidStateException;

enum Provider: string
{
    case github = 'github';
    case google = 'google';
}

class LoginController extends Controller
{
    public function post()
    {
        $validated = request()->validate([
            'email' => ['bail', 'required', 'string', 'email', 'max:50'],
            'password' => ['bail', 'required', 'string', 'min:1', 'max:50'],
            'remember_me' => ['bail', 'required', 'boolean'],
        ]);

        $data = collect($validated)->except('remember_me')->all();

        if (Auth::attempt($data, $validated['remember_me'])) {
            request()->session()->regenerate();

            return redirect()->intended()
                ->with('flashMessage', [
                    'type' => 'success',
                    'text' => 'You are logged in.',
                ]);
        }

        throw ValidationException::withMessages([
            'email' => 'email or password is wrong.',
        ]);
    }

    public function redirect(Provider $provider)
    {
        $provider = $provider->value;

        return Socialite::driver($provider)->redirect();
    }

    public function callback(Provider $provider)
    {
        try {
            $provider = $provider->value;

            $socialiteUser = collect(Socialite::driver($provider)->user())
                ->only([
                    'name',
                    'email',
                    'avatar',
                ])->all();

            $existingUser = User::where('email', $socialiteUser['email'])->first();

            if ($existingUser) {
                if ($existingUser->provider_name !== $provider) {
                    return redirect()->route('home')
                        ->with('flashMessage', [
                            'type' => 'error',
                            'text' => 'This email is already registered with a different provider. Please login with your original provider.',
                        ]);
                }
            } else {
                $newUser = User::create([
                    ...$socialiteUser,
                    'provider_name' => $provider,
                ]);
            }

            $user = $existingUser ?? $newUser;

            Auth::login($user, true);

            request()->session()->regenerate();

            return redirect()->intended()
                ->with('flashMessage', [
                    'type' => 'success',
                    'text' => 'You are logged in.',
                ]);
        } catch (ClientException $exception) {
            logger()->error($exception->getMessage());

            return redirect()->route('home')
                ->with('flashMessage', [
                    'type' => 'error',
                    'text' => 'Authentication failed. Please try again.',
                ]);
        } catch (InvalidStateException $exception) {
            logger()->error($exception->getMessage());

            return redirect()->route('home')
                ->with('flashMessage', [
                    'type' => 'error',
                    'text' => 'Session expired or invalid. Please try again.',
                ]);
        } catch (Exception $exception) {
            logger()->error($exception->getMessage());

            return redirect()->route('home')
                ->with('flashMessage', [
                    'type' => 'error',
                    'text' => 'Something went wrong. Please try again later.',
                ]);
        }
    }
}
