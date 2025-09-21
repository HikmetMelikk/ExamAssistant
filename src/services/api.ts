import AsyncStorage from "@react-native-async-storage/async-storage";
import type { AuthResponse, LoginData, RegisterData, User } from "../types";
import { dummyLogin, dummyRegister, getUserFromToken } from "./dummyData";

const API_BASE_URL = "https://your-api-url.com/api/v1"; // Backend URL'ini buraya ekleyeceksin

// Dummy mode - gerçek API'ye geçmek için false yapın
const USE_DUMMY_DATA = true;

class ApiService {
	private async getAuthToken(): Promise<string | null> {
		try {
			return await AsyncStorage.getItem("accessToken");
		} catch (error) {
			console.error("Error getting auth token:", error);
			return null;
		}
	}

	private async request<T>(
		endpoint: string,
		options: RequestInit = {},
	): Promise<T> {
		const token = await this.getAuthToken();
		const url = `${API_BASE_URL}${endpoint}`;

		const config: RequestInit = {
			headers: {
				"Content-Type": "application/json",
				...(token && { Authorization: `Bearer ${token}` }),
			},
			...options,
		};

		try {
			const response = await fetch(url, config);

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				throw new Error(errorData.message || `HTTP ${response.status}`);
			}

			return await response.json();
		} catch (error) {
			console.error(`API Error (${endpoint}):`, error);
			throw error;
		}
	}

	// Auth endpoints
	async register(data: RegisterData): Promise<AuthResponse> {
		if (USE_DUMMY_DATA) {
			const response = await dummyRegister(data);
			// Token'ı kaydet
			await AsyncStorage.setItem("accessToken", response.accessToken);
			return response;
		}

		const response = await this.request<AuthResponse>("/auth/register", {
			method: "POST",
			body: JSON.stringify(data),
		});

		// Token'ı kaydet
		await AsyncStorage.setItem("accessToken", response.accessToken);
		return response;
	}

	async login(data: LoginData): Promise<AuthResponse> {
		if (USE_DUMMY_DATA) {
			const response = await dummyLogin(data);
			// Token'ı kaydet
			await AsyncStorage.setItem("accessToken", response.accessToken);
			return response;
		}

		const response = await this.request<AuthResponse>("/auth/login", {
			method: "POST",
			body: JSON.stringify(data),
		});

		// Token'ı kaydet
		await AsyncStorage.setItem("accessToken", response.accessToken);
		return response;
	}

	async logout(): Promise<void> {
		await AsyncStorage.removeItem("accessToken");
	}

	async getCurrentUser(): Promise<User> {
		if (USE_DUMMY_DATA) {
			const token = await this.getAuthToken();
			if (!token) {
				throw new Error("Token bulunamadı");
			}
			const user = await getUserFromToken(token);
			if (!user) {
				throw new Error("Kullanıcı bulunamadı");
			}
			return user;
		}

		return await this.request<User>("/user/me");
	}

	async updateFCMToken(fcmToken: string): Promise<void> {
		await this.request("/auth/update-fcm", {
			method: "POST",
			body: JSON.stringify({ fcmToken }),
		});
	}

	// User endpoints
	async updateUser(data: Partial<User>): Promise<User> {
		return await this.request<User>("/user/me", {
			method: "PUT",
			body: JSON.stringify(data),
		});
	}

	// Exam endpoints - Backend hazır olunca kullanılacak
	async createExam(examData: any): Promise<any> {
		return await this.request("/exams", {
			method: "POST",
			body: JSON.stringify(examData),
		});
	}

	async getExams(type?: string): Promise<any[]> {
		const endpoint = type ? `/exams?type=${type}` : "/exams";
		return await this.request(endpoint);
	}

	async getExamById(id: string): Promise<any> {
		return await this.request(`/exams/${id}`);
	}

	async deleteExam(id: string): Promise<void> {
		await this.request(`/exams/${id}`, {
			method: "DELETE",
		});
	}

	// Analysis endpoints - Backend hazır olunca kullanılacak
	async getDashboardData(): Promise<any> {
		return await this.request("/analysis/dashboard");
	}

	async getLessonsAnalysis(): Promise<any> {
		return await this.request("/analysis/lessons");
	}
}

export const apiService = new ApiService();
