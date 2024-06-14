<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('book', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable();
            $table->string('autor')->nullable();
            $table->date('releaseDate')->nullable();
            $table->integer('borrowedFrom')->nullable();
            $table->boolean('isBorrowed')->default(false)->nullable();
            $table->date('borrowedAt')->nullable();
            $table->date('returnedAt')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('book');
    }
};
