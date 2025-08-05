<?php

namespace App\Http\Controllers\Events;

use App\Events\EventNotification;
use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\Etudiant;
use App\Models\Events;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Str;

class EventsController extends Controller
{
    public function createEvent(Request $request)
    {
        $this->authorize('admin_or_encadrant_or_HR');
        // Validate the request data
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'start' => 'required|date',
            'end' => 'required|date|after_or_equal:start',
            'description' => 'nullable|string',
            'type' => 'required|in:presentiel,onligne',
            'calendarId' => 'nullable|string|max:255',
            'users' => 'required|array',
        ]);

        if ($data['type'] === 'onligne') {
            $data['room_name'] = 'meet-room-' . Str::random(6) . '-' . Date::now()->format('YmdHis');
        }
        $event = Events::create($data);
        $message = "You are invited to " . $data['title'] . " event.";
        if (!empty($data['room_name'])) {
            $message .= " Room name: " . $data['room_name'];
        }
        $this->createNotifications($data['users'], 'New Event Created', $message);

        event(new EventNotification($message, $data['users']));
        $this->attachEventToUser($data["users"], $event);

        return response()->json(['status' => 'success', 'event' => $event], 201);
    }

    public function getEvents()
    {
        $events = Events::all();
        return response()->json(['status' => 'success', 'events' => $events]);
    }

    public function updateEvent(Request $request, $id)
    {
        $this->authorize('admin_or_encadrant_or_HR');
        // Validate the request data
        $data = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'start' => 'sometimes|required|date',
            'end' => 'sometimes|required|date|after_or_equal:start',
            'description' => 'nullable|string',
            'type' => 'sometimes|required|in:presentiel,onligne',
            'calendarId' => 'nullable|string|max:255',
        ]);

        $event = Events::findOrFail($id);
        $event->update($data);
        if ($event->type === 'presentiel') {
            $event->room_name = null;
            $event->save();
        }

        return response()->json(['status' => 'success', 'event' => $event]);
    }

    public function deleteEvent($id)
    {
        $this->authorize('admin_or_encadrant_or_HR');
        Events::destroy($id);
        return response()->json(['status' => 'success', 'message' => 'Event deleted successfully']);
    }

    public function getEventById($id)
    {
        $event = Events::findOrFail($id);
        return response()->json(['status' => 'success', 'event' => $event]);
    }

    public function attachEventToUser(array $users, Events $event)
    {
        foreach ($users as $userId) {
            $user = User::on('admin')->findOrFail($userId);
            if ($user->userable_type === "App\Models\Etudiant") {
                $etudiant = Etudiant::on('tenant')->where('id', $user->userable_id)->first();
                $etudiant->events()->associate($event->id); // or $event instance
                $etudiant->save();
            } elseif ($user->userable_type === "App\Models\Employee") {
                $employee = Employee::on('tenant')->where('id', $user->userable_id)->first();
                $employee->events()->associate($event->id); // or $event instance
                $employee->save();
            }
        }

        return response()->json(['status' => 'success', 'message' => 'Event attached successfully!']);
    }

    private function createNotifications(array $userIds, string $title, string $message): void
    {
        foreach ($userIds as $userId) {
            Notification::on('admin')->create([
                'user_id' => $userId,
                'title' => $title,
                'message' => $message,
            ]);
        }
    }
}
