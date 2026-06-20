<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Cause;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@donation.org',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        User::create([
            'name' => 'Test User',
            'email' => 'user@donation.org',
            'password' => Hash::make('password'),
            'role' => 'user',
        ]);

        $causes = [
            ['title' => 'Clean Water for All', 'description' => 'Providing clean drinking water to rural communities in need.', 'goal_amount' => 50000, 'image_url' => 'https://images.unsplash.com/photo-1541844053589-346841d0b34c?w=800'],
            ['title' => 'Education for Children', 'description' => 'Building schools and providing educational materials for underprivileged children.', 'goal_amount' => 75000, 'image_url' => 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800'],
            ['title' => 'Food Relief Program', 'description' => 'Delivering nutritious meals to families affected by food insecurity.', 'goal_amount' => 30000, 'image_url' => 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800'],
            ['title' => 'Healthcare Access', 'description' => 'Providing medical care and medicines to underserved communities.', 'goal_amount' => 100000, 'image_url' => 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800'],
        ];

        foreach ($causes as $cause) {
            Cause::create(array_merge($cause, [
                'slug' => \Illuminate\Support\Str::slug($cause['title']),
                'raised_amount' => rand(1000, (int) ($cause['goal_amount'] * 0.8)),
                'status' => 'active',
            ]));
        }
    }
}
