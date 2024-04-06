<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateFactureRequest extends FormRequest
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
            "numfacture"=>"required|string",
            'Client'=>"required|string",
            "Reduction"=>"string",
            "User"=>"string",
            "user_id"=>"string",
            "reduction_id"=>"string",
            "is_paid"=>"boolean",
            "client_id"=>"required|string",
            "special_id"=>"required|string",
            'is_deleted'=>"boolean",
            'created_at'=>"datetime",
            'updated_at'=>"datetime",
            'deleted_at'=>"datetime",
        ];
    }
}
