import { StyleSheet, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Link } from 'expo-router';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('admin');
  const router = useRouter();

  // Theme colors
  const backgroundColor = useThemeColor({}, 'background');
  const cardBackgroundColor = useThemeColor({}, 'cardBackground');
  const borderColor = useThemeColor({}, 'border');
  const textColor = useThemeColor({}, 'text');
  const textSecondaryColor = useThemeColor({}, 'textSecondary');
  const textTertiaryColor = useThemeColor({}, 'textTertiary');
  const primaryColor = useThemeColor({}, 'primary');

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    // Simulate login - in a real app, you would call an API
    console.log('Login attempt with:', { email, password, userType });
    router.replace('/(tabs)');
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: backgroundColor }]}>
      <View style={[styles.loginContainer, { backgroundColor: cardBackgroundColor }]}>
        <View style={styles.loginHeader}>
          <ThemedText style={[styles.title, { color: primaryColor }]}>SMART INVENTORY MANAGEMENT</ThemedText>
          <ThemedText style={[styles.subtitle, { color: textTertiaryColor }]}>Predictive Replenishment and Alert Notifications</ThemedText>
        </View>

        <View style={styles.form}>
          <View style={styles.formGroup}>
            <ThemedText style={[styles.label, { color: textSecondaryColor }]}>Email</ThemedText>
            <TextInput
              style={[styles.input, { backgroundColor: cardBackgroundColor, borderColor: borderColor, color: textColor }]}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="Enter your email"
              placeholderTextColor={textTertiaryColor}
            />
          </View>

          <View style={styles.formGroup}>
            <ThemedText style={[styles.label, { color: textSecondaryColor }]}>Password</ThemedText>
            <TextInput
              style={[styles.input, { backgroundColor: cardBackgroundColor, borderColor: borderColor, color: textColor }]}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="Enter your password"
              placeholderTextColor={textTertiaryColor}
            />
          </View>

          <View style={[styles.roleToggle, { backgroundColor: borderColor }]}>
            <TouchableOpacity
              style={[styles.roleBtn, userType === 'admin' && styles.activeRoleBtn, userType === 'admin' ? { backgroundColor: primaryColor } : { backgroundColor: cardBackgroundColor }]}
              onPress={() => setUserType('admin')}>
              <ThemedText style={[styles.roleBtnText, userType === 'admin' && styles.activeRoleBtnText, userType === 'admin' ? { color: '#ffffff' } : { color: textSecondaryColor }]}>Admin</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.roleBtn, userType === 'staff' && styles.activeRoleBtn, userType === 'staff' ? { backgroundColor: primaryColor } : { backgroundColor: cardBackgroundColor }]}
              onPress={() => setUserType('staff')}>
              <ThemedText style={[styles.roleBtnText, userType === 'staff' && styles.activeRoleBtnText, userType === 'staff' ? { color: '#ffffff' } : { color: textSecondaryColor }]}>Staff</ThemedText>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={[styles.loginBtn, { backgroundColor: primaryColor }]} onPress={handleLogin}>
            <ThemedText style={[styles.loginBtnText, { color: '#ffffff' }]}>Login</ThemedText>
          </TouchableOpacity>

          <View style={styles.accountOptions}>
            <ThemedText style={[styles.accountText, { color: textTertiaryColor }]}>
              Don't have an account?{' '}
              <Link href="/register">
                <ThemedText style={[styles.linkText, { color: primaryColor }]}>Create Account</ThemedText>
              </Link>
            </ThemedText>
          </View>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  loginContainer: {
    maxWidth: 400,
    marginHorizontal: 'auto',
    padding: 32,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  loginHeader: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    display: 'flex',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderRadius: 5,
    fontSize: 16,
  },
  roleToggle: {
    flexDirection: 'row',
    marginVertical: 24,
    borderRadius: 5,
    overflow: 'hidden',
  },
  roleBtn: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
  },
  activeRoleBtn: {
  },
  roleBtnText: {
    fontWeight: '500',
  },
  activeRoleBtnText: {
  },
  loginBtn: {
    width: '100%',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 24,
  },
  loginBtnText: {
    fontSize: 16,
    fontWeight: '500',
  },
  accountOptions: {
    marginTop: 24,
    alignItems: 'center',
  },
  accountText: {
    fontSize: 14,
  },
  linkText: {
    fontWeight: '500',
  },
});