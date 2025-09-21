import type { AuthResponse, LoginData, RegisterData, User } from "../types";
import { AYTField, ExamType } from "../types";

// Dummy kullanıcı verileri
export const dummyUsers: User[] = [
	{
		id: "1",
		email: "test@example.com",
		name: "Test Kullanıcı",
		examType: ExamType.TYT,
		createdAt: "2024-01-01T00:00:00Z",
		updatedAt: "2024-01-01T00:00:00Z",
	},
	{
		id: "2",
		email: "ayt@example.com",
		name: "AYT Kullanıcı",
		examType: ExamType.AYT,
		aytField: AYTField.SAYISAL,
		createdAt: "2024-01-01T00:00:00Z",
		updatedAt: "2024-01-01T00:00:00Z",
	},
	{
		id: "3",
		email: "admin@example.com",
		name: "Admin Kullanıcı",
		examType: ExamType.AYT,
		aytField: AYTField.ESIT_AGIRLIK,
		createdAt: "2024-01-01T00:00:00Z",
		updatedAt: "2024-01-01T00:00:00Z",
	},
];

// Dummy şifreler (gerçek uygulamada hash'lenmiş olacak)
export const dummyPasswords: { [email: string]: string } = {
	"test@example.com": "123456",
	"ayt@example.com": "password",
	"admin@example.com": "admin123",
};

// Dummy token'lar
export const dummyTokens: { [email: string]: string } = {
	"test@example.com": "dummy_token_test_user_12345",
	"ayt@example.com": "dummy_token_ayt_user_67890",
	"admin@example.com": "dummy_token_admin_user_11111",
};

// Dummy login fonksiyonu
export const dummyLogin = async (data: LoginData): Promise<AuthResponse> => {
	// Simüle edilmiş network gecikmesi
	await new Promise((resolve) => setTimeout(resolve, 1000));

	const user = dummyUsers.find((u) => u.email === data.email);
	const password = dummyPasswords[data.email];

	if (!user || password !== data.password) {
		throw new Error("E-posta adresi veya şifre hatalı");
	}

	const token = dummyTokens[data.email];
	if (!token) {
		throw new Error("Token oluşturulamadı");
	}

	return {
		accessToken: token,
		user: user,
	};
};

// Dummy register fonksiyonu
export const dummyRegister = async (
	data: RegisterData,
): Promise<AuthResponse> => {
	// Simüle edilmiş network gecikmesi
	await new Promise((resolve) => setTimeout(resolve, 1500));

	// E-posta zaten kayıtlı mı kontrol et
	const existingUser = dummyUsers.find((u) => u.email === data.email);
	if (existingUser) {
		throw new Error("Bu e-posta adresi zaten kayıtlı");
	}

	// Yeni kullanıcı oluştur
	const newUser: User = {
		id: (dummyUsers.length + 1).toString(),
		email: data.email,
		name: data.name,
		examType: data.examType,
		aytField: data.aytField,
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	};

	// Dummy verilerine ekle
	dummyUsers.push(newUser);
	dummyPasswords[data.email] = data.password;
	dummyTokens[data.email] =
		`dummy_token_${data.email.replace("@", "_").replace(".", "_")}_${Date.now()}`;

	return {
		accessToken: dummyTokens[data.email],
		user: newUser,
	};
};

// Token'dan kullanıcı bulma
export const getUserFromToken = async (token: string): Promise<User | null> => {
	// Simüle edilmiş network gecikmesi
	await new Promise((resolve) => setTimeout(resolve, 500));

	const userEmail = Object.keys(dummyTokens).find(
		(email) => dummyTokens[email] === token,
	);
	if (!userEmail) {
		return null;
	}

	return dummyUsers.find((u) => u.email === userEmail) || null;
};
