<?php

use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

// Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
//     return (int) $user->id === (int) $id;
// });
Broadcast::channel('messenger.{reciever}', function ($user, $receiver) {
    return (int) $user->id === (int) $receiver;
});
Broadcast::channel('group_chat.{roomId}', function ($user, $roomId) {
    return [
        'id' => $user->id,
        'nom' => $user->nom,
    ];
});
Broadcast::channel('channel-name', function ($user) {
    return [
        'user' => $user,
    ];
});

Broadcast::channel('user.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});
