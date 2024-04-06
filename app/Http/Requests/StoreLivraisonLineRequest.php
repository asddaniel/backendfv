<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreLivraisonLineRequest extends FormRequest
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
            'livraison_id'=>'required|string',
            'Livraison'=>"required|string",
            'Produit'=>"required|string",
            'CodeBarre'=>"required|string",
            'produit_id'=>'string',
            'quantite'=>'required|integer',
            'code_barre_id'=>'required|string', 
            "special_id"=>"required|string",
            'is_deleted'=>"boolean",
            'created_at'=>"datetime",
            'updated_at'=>"datetime",
            'deleted_at'=>"datetime",
        ];
    }
}
