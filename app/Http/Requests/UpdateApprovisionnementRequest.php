<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateApprovisionnementRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'fournisseur_id'=>"required|string",
            'Fournisseur'=>"required|string",
            'Produit'=>"required|string",
            'produit_id'=>"required|string",
            'quantite'=>"required|integer",
            'prix'=>"required|numeric",
            'description'=>"string",
            'is_deleted'=>"boolean",
            'created_at'=>"datetime",
            'updated_at'=>"datetime",
            'deleted_at'=>"datetime",
            'special_id'=>"required|string",
        ];
    }
}
