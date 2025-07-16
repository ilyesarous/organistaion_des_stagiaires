<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class VerifyAccountMail extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $link;

    public function __construct($user, $link)
    {
        $this->user = $user;
        $this->link = $link;
    }

    public function build()
    {
        return $this->subject('Complete Your Registration')
            ->html("
            Bonjour {$this->user->prenom} {$this->user->nom},<br><br>
            Merci de vous être inscrit(e).<br><br>
            Veuillez compléter votre inscription en cliquant sur ce lien :<br>
            <a href=\"{$this->link}\">Complete your registration</a><br><br>
            Cordialement,<br>L'équipe
        ");
    }
}
