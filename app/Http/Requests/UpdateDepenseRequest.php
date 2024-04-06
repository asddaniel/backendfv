<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDepenseRequest extends FormRequest
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
            "special_id"=>"required|string", 
            "libelle"=>"required|string",
            "description"=>"string",
            'is_deleted'=>"boolean",
            'created_at'=>"datetime",
            'updated_at'=>"datetime",
            'deleted_at'=>"datetime",
            'montant'=>"required|numeric"
        ];
    }
}
