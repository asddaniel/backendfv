<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateLivraisonRequest extends FormRequest
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
            'facture_id'=>"required|string",
            'Facture'=>"required|string",
            "User"=>"string",
            'created_at'=>"datetime",
            'updated_at'=>"datetime",
            'special_id'=>"required|string",
            'is_deleted'=>"boolean",
            "deleted_at"=>"datetime",
            'user_id'=>"required|string",
        ];
    }
}
