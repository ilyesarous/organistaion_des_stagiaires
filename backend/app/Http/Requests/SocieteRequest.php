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
            'matricule_fiscale' => 'required|string|max:255',
            'uuid' => 'required|string|max:255',
            'raison_sociale' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'site_web' => 'required|url|max:255',
            'address' => 'required|string|max:255',
            'cachet' => 'sometimes|required|image|mimes:jpeg,png,jpg,gif|max:2048',
            'logo' => 'sometimes|required|image|mimes:jpeg,png,jpg,gif|max:2048',
            'html_template' => 'sometimes|required|file|mimes:html,htm',
        ];
    }
}
