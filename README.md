# Organisation des Stagiaires 🎓💼

A **full-stack multi-tenant internship management system** built with **Laravel 10, React TypeScript, and PostgreSQL**.  
Designed to help companies ("sociétés") efficiently manage their interns, supervisors, and internship processes.

---

## 🚀 Features
- **Multi-tenancy with database per société**
  - Parent DB holds users, roles, tenants, sociétés.
  - Each société has its own isolated database.
- **Role-based access control**
  - `SuperAdmin`: manages roles, permissions, and sociétés.
  - `Admin`: manages faculties, users, subjects, events, and attestation approvals.
  - `Encadrant`: supervises interns, manages subjects/events, requests attestations.
  - `Étudiant`: interacts with subjects and events, receives attestations.
- **Automated provisioning**
  - New société → new admin user + new tenant DB with migrations.
- **Event management**
  - Online (with video call integration via Jitsi/Judy).
  - In-person events with attendance tracking.
- **Attestations (Certificates)**
  - Workflow: Encadrant requests → Admin validates/approves → Auto-generated PDF using société’s custom template.

---

## 🛠️ Tech Stack
- **Frontend:** React + TypeScript
- **Backend:** Laravel 10
- **Database:** PostgreSQL (multi-tenant, multi-database)
- **Auth & Roles:** Laravel + custom middleware
- **PDF Generation:** Custom templates per société
- **Video Calls:** Jitsi/Judy integration

---

## 📦 Project Structure
- `parent database`: users, roles, tenants, sociétés
- `child database (per société)`: facultés, sujets, attestations, events, etudiants, encadrants

---

## ⚙️ Setup
1. Clone repository:
   ```bash
   git clone https://github.com/username/organisation-des-stagiaires.git
2. Install dependencies:
  - Backend (Laravel):
    `cd backend`
    `composer install`
  - Frontend (React)
    `cd frontend`
    `npm install`
3. Configure .env for both backend and frontend.
4. Run migrations & seeders for parent DB.
5. Start the application:
  - Laravel: - `php artisan serve`
             - `php artisan websocket:serve`
  - React: `npm run dev`

## Login Page:
<img width="1920" height="971" alt="{6A3F56B0-72FF-4ED7-BE99-377A9E5BCB87}" src="https://github.com/user-attachments/assets/fccacbc4-ace6-491c-8fb2-2022e9fcda1f" />

## SuperAdmin View:
<img width="1920" height="974" alt="{7AD7DA74-0DDA-47C0-968A-9F2CB5CA671E}" src="https://github.com/user-attachments/assets/f86f0a5b-9da3-4a79-8446-4b4514139634" />
<img width="1920" height="971" alt="{35432B64-F02C-43E7-B3D7-394FEAFA2AE8}" src="https://github.com/user-attachments/assets/4d2b5b4d-f2c2-4997-a944-bc694e0c0a41" />
<img width="1920" height="970" alt="{C81B9017-C840-418A-9B88-57F96F11FF50}" src="https://github.com/user-attachments/assets/7d584af8-0f34-4c73-a147-d7e0aa0a10a3" />

## Admin View:
<img width="1920" height="972" alt="{85F249CE-D0A6-45E7-A75A-4FDB3F78F7D2}" src="https://github.com/user-attachments/assets/55fe4c7f-30f8-4025-9cf4-3bd89ec5e069" />
<img width="1920" height="974" alt="{596AFD38-D07A-4B91-BD4D-9EB6E8C89DCA}" src="https://github.com/user-attachments/assets/35f26c5b-f124-41d0-9da2-c272e3f0c647" />
<img width="1920" height="970" alt="{C57C91C4-E6E0-4E85-85FD-DFEEFB4F68F3}" src="https://github.com/user-attachments/assets/05ccd0e6-fdb9-41be-9e94-abc25022eef2" />
<img width="1920" height="974" alt="{C304C6A5-2445-4886-8320-0F334DD0581F}" src="https://github.com/user-attachments/assets/ead30e00-fcb7-4b7c-a081-b9e65a362556" />
<img width="1920" height="976" alt="{0B4BFC85-F492-4529-A7BB-6647DB0704C0}" src="https://github.com/user-attachments/assets/84bb9926-64ac-46ba-8bab-ff090083648b" />
<img width="1920" height="971" alt="{6D7CFC37-9A20-4AA4-95F5-7260FF1A1CA2}" src="https://github.com/user-attachments/assets/47e289b5-092d-4439-ab02-b2ddf18df217" />
<img width="1920" height="973" alt="{84ADFC56-2DC7-430D-AB49-47DD52338F8D}" src="https://github.com/user-attachments/assets/0a906ec1-f714-40b5-ad6f-f1354f8a0ec7" />
<img width="1920" height="970" alt="{121DE4F1-923E-4864-AC8E-611AEBA00533}" src="https://github.com/user-attachments/assets/d4822bb1-7a7e-4b45-87fc-b0faa39212c3" />
<img width="1920" height="971" alt="{28004EAE-67D8-4DAA-A452-593FC5EA382A}" src="https://github.com/user-attachments/assets/402481b1-3870-4ccf-9491-9fc49eb1f32f" />
<img width="1920" height="972" alt="{63C34705-52CB-454D-BCFB-181F6B3627A4}" src="https://github.com/user-attachments/assets/9febc2cc-9349-483a-86da-df0e6ce0f9b4" />

## Encadrant View: 
<img width="1920" height="971" alt="{BCB5B8D8-1CD1-411E-B7E8-FD033A07BFFF}" src="https://github.com/user-attachments/assets/740cad3d-924b-43bd-aad9-cc4ebce79f5d" />
<img width="1920" height="969" alt="{6DA6A040-9E95-4AF0-A830-432D782623E2}" src="https://github.com/user-attachments/assets/a97bc30b-cf90-4d54-b88c-1ee1ab9103f2" />

## Etudiant View:
<img width="1920" height="973" alt="{1A4337F9-15C8-46BA-A814-7A3344028B4D}" src="https://github.com/user-attachments/assets/de611128-3fc0-4f40-9ba9-d5fd15fe457e" />
<img width="1920" height="970" alt="{D518922A-22D7-49C8-B481-EC44B4FE4521}" src="https://github.com/user-attachments/assets/80f619fd-b565-422f-b37a-5c7f59729fda" />

## Chat View:
<img width="1920" height="976" alt="{B91DE729-7EB1-4C4D-A030-95C8431945D9}" src="https://github.com/user-attachments/assets/d1bf775e-f988-46e2-bf82-015cca07a908" />
<img width="1920" height="975" alt="{FB02017F-8042-44DB-A975-D2364850B67B}" src="https://github.com/user-attachments/assets/d00b27c0-de8e-4961-88f7-e26f96f4c4c6" />



       
