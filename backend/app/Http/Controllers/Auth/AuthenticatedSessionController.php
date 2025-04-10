<?php
namespace App\Http\Controllers\Auth;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;

class AuthenticatedSessionController extends Controller
{
    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): Response
    {
        $request->authenticate();
        $request->session()->regenerate();
        return response()->noContent();
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): Response
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        // Obtener el nombre de la cookie de sesión de Laravel
        $cookieName = config('session.cookie');

        // Crear una respuesta y eliminar explícitamente la cookie
        $response = response()->noContent();

        // Eliminar la cookie de sesión
        $response->withoutCookie($cookieName);

        // También intenta eliminar con el nombre específico si es diferente
        if ($cookieName !== 'sgi_tamarido_session') {
            $response->withoutCookie('sgi_tamarido_session');
        }

        // Eliminar otras cookies relacionadas con la autenticación
        $response->withoutCookie('XSRF-TOKEN');

        return $response;
    }
}
