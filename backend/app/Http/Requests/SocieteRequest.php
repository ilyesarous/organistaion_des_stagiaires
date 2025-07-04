<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SocieteRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'matricule_fiscale' => ['required', 'string', 'max:255'],
            'uuid' => ['required', 'string', 'max:255'],
            'raison_sociale' => ['required', 'string', 'max:255'],
            'email' => ['nullable', 'email:filter', 'max:255'],
            'phone' => ['nullable', 'string', 'max:15'],
            'site_web' => ['nullable', 'string', 'max:255'],
            'address' => ['nullable', 'string', 'max:255'],
            'cachet' => ['nullable', 'string', 'max:2048'],
            'logo' => ['nullable', 'string', 'max:2048'],
        ];
    }
}
