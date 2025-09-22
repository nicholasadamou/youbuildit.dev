'use client';

import { useUser } from '@clerk/nextjs';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Camera,
  Save,
  X,
  Check,
  User,
  Mail,
  Calendar,
  Shield,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function CustomProfile() {
  const { user, isLoaded } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
  });

  // Initialize form data when user loads
  React.useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
      });
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      await user.update({
        firstName: formData.firstName,
        lastName: formData.lastName,
      });

      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
      });
    }
    setIsEditing(false);
  };

  const handleAvatarUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    try {
      await user.setProfileImage({ file });
      toast.success('Profile picture updated successfully!');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Failed to update profile picture. Please try again.');
    }
  };

  if (!isLoaded) {
    return (
      <div className="space-y-6">
        {/* Loading skeleton */}
        <div className="animate-pulse space-y-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-muted rounded-full" />
            <div className="space-y-2">
              <div className="h-6 bg-muted rounded w-40" />
              <div className="h-4 bg-muted rounded w-60" />
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-4 bg-muted rounded w-20" />
            <div className="h-10 bg-muted rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">
            Unable to load profile information.
          </p>
        </CardContent>
      </Card>
    );
  }

  const initials =
    user.firstName && user.lastName
      ? `${user.firstName[0]}${user.lastName[0]}`
      : user.emailAddresses[0]?.emailAddress[0].toUpperCase() || '?';

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="bg-card border border-border shadow-lg rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-[#37d388]/5 to-[#37d388]/10 px-6 py-4 border-b border-border">
          <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-3">
            <div className="p-2 bg-[#37d388]/10 rounded-lg">
              <User className="h-5 w-5 text-[#37d388]" />
            </div>
            Profile Information
          </CardTitle>
          <CardDescription className="mt-1 text-muted-foreground">
            Manage your personal information and profile settings.
          </CardDescription>
        </div>

        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Avatar Section */}
            <div className="flex items-center space-x-6">
              <div className="relative">
                <Avatar className="w-20 h-20 border-4 border-border">
                  <AvatarImage
                    src={user.imageUrl}
                    alt={user.fullName || 'User'}
                  />
                  <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-xl">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <label className="absolute -bottom-1 -right-1 p-2 bg-primary text-primary-foreground rounded-full cursor-pointer hover:bg-primary/90 transition-colors shadow-lg">
                  <Camera className="w-4 h-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </label>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-foreground">
                  {user.fullName || 'User'}
                </h3>
                <p className="text-muted-foreground">
                  {user.primaryEmailAddress?.emailAddress}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <Shield className="w-3 h-3" />
                    Verified Account
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Joined {new Date(user.createdAt!).toLocaleDateString()}
                  </Badge>
                </div>
              </div>
            </div>

            <Separator />

            {/* Basic Information */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold text-foreground">
                  Basic Information
                </h4>
                <AnimatePresence mode="wait">
                  {!isEditing ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2"
                      >
                        <User className="w-4 h-4" />
                        Edit Profile
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div
                      className="flex items-center gap-2"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCancel}
                        disabled={isSaving}
                        className="flex items-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 bg-[#37d388] hover:bg-[#2aa86b]"
                      >
                        {isSaving ? (
                          <motion.div
                            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: 'linear',
                            }}
                          />
                        ) : (
                          <Save className="w-4 h-4" />
                        )}
                        {isSaving ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="firstName"
                    className="text-sm font-medium text-foreground"
                  >
                    First Name
                  </Label>
                  {isEditing ? (
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={e =>
                        setFormData(prev => ({
                          ...prev,
                          firstName: e.target.value,
                        }))
                      }
                      placeholder="Enter your first name"
                      className="bg-background border-border"
                    />
                  ) : (
                    <div className="p-3 bg-muted/30 border border-border rounded-md">
                      <p className="text-foreground">
                        {user.firstName || 'Not provided'}
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="lastName"
                    className="text-sm font-medium text-foreground"
                  >
                    Last Name
                  </Label>
                  {isEditing ? (
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={e =>
                        setFormData(prev => ({
                          ...prev,
                          lastName: e.target.value,
                        }))
                      }
                      placeholder="Enter your last name"
                      className="bg-background border-border"
                    />
                  ) : (
                    <div className="p-3 bg-muted/30 border border-border rounded-md">
                      <p className="text-foreground">
                        {user.lastName || 'Not provided'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* Account Information */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-foreground">
                Account Information
              </h4>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Primary Email
                  </Label>
                  <div className="p-3 bg-muted/30 border border-border rounded-md">
                    <div className="flex items-center justify-between">
                      <p className="text-foreground">
                        {user.primaryEmailAddress?.emailAddress}
                      </p>
                      <Badge
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" />
                        Verified
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Member Since
                  </Label>
                  <div className="p-3 bg-muted/30 border border-border rounded-md">
                    <p className="text-foreground">
                      {new Date(user.createdAt!).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
