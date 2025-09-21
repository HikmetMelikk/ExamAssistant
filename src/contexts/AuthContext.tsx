import AsyncStorage from "@react-native-async-storage/async-storage";
import type React from "react";
import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";
import { apiService } from "../services/api";
import type { LoginData, RegisterData, User } from "../types";

interface AuthContextType {
	user: User | null;
	isLoading: boolean;
	isAuthenticated: boolean;
	login: (data: LoginData) => Promise<void>;
	register: (data: RegisterData) => Promise<void>;
	logout: () => Promise<void>;
	checkAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};

interface AuthProviderProps {
	children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	const checkAuthStatus = async () => {
		try {
			const token = await AsyncStorage.getItem("accessToken");
			if (token) {
				// Token varsa kullanıcı bilgilerini al
				const userData = await apiService.getCurrentUser();
				setUser(userData);
			}
		} catch (error) {
			console.error("Auth check failed:", error);
			// Token geçersizse temizle
			await AsyncStorage.removeItem("accessToken");
			setUser(null);
		} finally {
			setIsLoading(false);
		}
	};

	const login = async (data: LoginData) => {
		try {
			setIsLoading(true);
			const response = await apiService.login(data);
			setUser(response.user);
		} catch (error) {
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	const register = async (data: RegisterData) => {
		try {
			setIsLoading(true);
			const response = await apiService.register(data);
			setUser(response.user);
		} catch (error) {
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	const logout = async () => {
		try {
			await apiService.logout();
			setUser(null);
		} catch (error) {
			console.error("Logout error:", error);
			// Hata olsa bile kullanıcıyı çıkış yap
			setUser(null);
		}
	};

	useEffect(() => {
		checkAuthStatus();
	}, []);

	return (
		<AuthContext.Provider
			value={{
				user,
				isLoading,
				isAuthenticated: !!user,
				login,
				register,
				logout,
				checkAuthStatus,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
