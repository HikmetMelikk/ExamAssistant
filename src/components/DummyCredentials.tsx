import type React from "react";
import { useState } from "react";
import {
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import Icon from "./Icons";

interface DummyCredentialsProps {
	onSelectCredentials: (email: string, password: string) => void;
}

const DummyCredentials: React.FC<DummyCredentialsProps> = ({
	onSelectCredentials,
}) => {
	const [isExpanded, setIsExpanded] = useState(false);

	const credentials = [
		{
			name: "Test Kullanıcı (TYT)",
			email: "test@example.com",
			password: "123456",
			description: "TYT sınavı için test kullanıcısı",
		},
		{
			name: "AYT Kullanıcı (Sayısal)",
			email: "ayt@example.com",
			password: "password",
			description: "AYT Sayısal alanı için test kullanıcısı",
		},
		{
			name: "Admin Kullanıcı (Eşit Ağırlık)",
			email: "admin@example.com",
			password: "admin123",
			description: "AYT Eşit Ağırlık alanı için test kullanıcısı",
		},
	];

	return (
		<View style={styles.container}>
			<TouchableOpacity
				style={styles.header}
				onPress={() => setIsExpanded(!isExpanded)}
			>
				<View style={styles.headerContent}>
					<Icon name="info" size={20} color="#4285F4" />
					<Text style={styles.headerText}>Test Hesapları</Text>
				</View>
				<Icon
					name={isExpanded ? "keyboard-arrow-up" : "keyboard-arrow-down"}
					size={24}
					color="#4285F4"
				/>
			</TouchableOpacity>

			{isExpanded && (
				<ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
					<Text style={styles.description}>
						Giriş yapmak için aşağıdaki test hesaplarından birini
						kullanabilirsiniz:
					</Text>

					{credentials.map((cred) => (
						<View key={cred.email} style={styles.credentialCard}>
							<Text style={styles.credentialName}>{cred.name}</Text>
							<Text style={styles.credentialDescription}>
								{cred.description}
							</Text>

							<View style={styles.credentialInfo}>
								<View style={styles.credentialRow}>
									<Text style={styles.credentialLabel}>E-posta:</Text>
									<Text style={styles.credentialValue}>{cred.email}</Text>
								</View>
								<View style={styles.credentialRow}>
									<Text style={styles.credentialLabel}>Şifre:</Text>
									<Text style={styles.credentialValue}>{cred.password}</Text>
								</View>
							</View>

							<TouchableOpacity
								style={styles.useButton}
								onPress={() => onSelectCredentials(cred.email, cred.password)}
							>
								<Icon name="login" size={16} color="#FFFFFF" />
								<Text style={styles.useButtonText}>Bu Hesabı Kullan</Text>
							</TouchableOpacity>
						</View>
					))}
				</ScrollView>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#F0F7FF",
		borderRadius: 12,
		marginBottom: 20,
		borderWidth: 1,
		borderColor: "#E3F2FD",
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		padding: 16,
	},
	headerContent: {
		flexDirection: "row",
		alignItems: "center",
	},
	headerText: {
		fontSize: 16,
		fontWeight: "600",
		color: "#4285F4",
		marginLeft: 8,
	},
	content: {
		maxHeight: 300,
		paddingHorizontal: 16,
		paddingBottom: 16,
	},
	description: {
		fontSize: 14,
		color: "#666666",
		marginBottom: 16,
		lineHeight: 20,
	},
	credentialCard: {
		backgroundColor: "#FFFFFF",
		borderRadius: 8,
		padding: 12,
		marginBottom: 12,
		borderWidth: 1,
		borderColor: "#E5E7EB",
	},
	credentialName: {
		fontSize: 14,
		fontWeight: "600",
		color: "#1A1A1A",
		marginBottom: 4,
	},
	credentialDescription: {
		fontSize: 12,
		color: "#666666",
		marginBottom: 8,
	},
	credentialInfo: {
		marginBottom: 12,
	},
	credentialRow: {
		flexDirection: "row",
		marginBottom: 4,
	},
	credentialLabel: {
		fontSize: 12,
		color: "#666666",
		width: 60,
	},
	credentialValue: {
		fontSize: 12,
		color: "#1A1A1A",
		fontWeight: "500",
		flex: 1,
	},
	useButton: {
		backgroundColor: "#4285F4",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 8,
		paddingHorizontal: 12,
		borderRadius: 6,
	},
	useButtonText: {
		color: "#FFFFFF",
		fontSize: 12,
		fontWeight: "600",
		marginLeft: 4,
	},
});

export default DummyCredentials;
