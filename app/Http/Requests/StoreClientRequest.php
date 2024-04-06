<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreClientRequest extends FormRequest
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
            "name"=>'required',
            "tel"=>'string',
            "email"=>'string',
            'is_deleted'=>"boolean",
            'created_at'=>"datetime",
            'updated_at'=>"datetime",
            'deleted_at'=>"datetime",
            'special_id'=>"required|string",
        ];
    }
}
