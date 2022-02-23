//icons repository

import React from 'react';
import { Feather, Ionicons } from '@expo/vector-icons';
import { Icon, Spinner } from '@ui-kitten/components';
import { View } from 'react-native';

export const SunIcon = color => <Ionicons name="ios-sunny" size={24} color={color} />;
export const MoonIcon = color => <Ionicons name="ios-moon" size={24} color={color} />;
export const ImageIcon = color => <Feather name="image" size={80} color={color} />;
export const CameraIcon = color => <Feather name="camera" size={80} color={color} />;
export const BackArrowIcon = color => <Ionicons name="ios-arrow-back" size={24} color={color} />;
export const alertIcon = props => <Icon {...props} name="alert-circle-outline" />;

export const PersonIcon = props => <Icon {...props} name="person" />;
export const BrushIcon = props => <Icon {...props} name="brush" />;
export const LoadingIndicator = () => (
  <View style={{ justifyContent: 'center', alignItems: 'center' }}>
    <Spinner size="small" status="control" />
  </View>
);
