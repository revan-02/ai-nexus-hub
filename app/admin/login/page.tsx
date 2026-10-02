import { redirect } from 'next/navigation';

// /admin/login has been removed for security.
// Admin users log in through the standard /login page.
export default function AdminLoginPage() {
  redirect('/login');
}
