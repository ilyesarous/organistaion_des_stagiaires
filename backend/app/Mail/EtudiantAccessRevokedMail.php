<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class EtudiantAccessRevokedMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public $user;
    public function __construct($user)
    {
        $this->user = $user;
    }
    public function build()
    {
        return $this->subject('Accès à votre compte étudiant désactivé')
            ->html("
                    Bonjour {$this->user->prenom} {$this->user->nom},<br><br>
                    Nous vous informons que votre compte étudiant n'est plus fonctionnel.<br><br>
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
            subject: 'Etudiant Access Revoked Mail',
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
