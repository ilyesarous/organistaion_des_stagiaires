<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class EtudiantAccessRevokedAfterDelayMail extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $nbDays;
    public function __construct($user, $nbDays)
    {
        $this->user = $user;
        $this->nbDays = $nbDays;
    }
    public function build()
    {
        return $this->subject('Accès à votre compte étudiant désactivé')
            ->html("
    Bonjour {$this->user->prenom} {$this->user->nom},<br><br>
    Nous vous informons que votre compte étudiant sera suspendu dans {$this->nbDays} jours.<br><br>
    Si vous pensez qu'il s'agit d'une erreur, veuillez contacter l'administration.<br><br>
    Cordialement,<br>L'équipe de gestion
    ");
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Etudiant Access Revoked After Delay Mail',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'view.name',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
