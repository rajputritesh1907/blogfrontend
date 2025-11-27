'use client';

import { useState, useRef } from 'react';
import { Button } from './ui/Button';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function ImageUpload({ images, onImagesChange, maxImages = 10 }) {
    const [isDragging, setIsDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    };

    const handleFileSelect = async (files) => {
        if (images.length + files.length > maxImages) {
            alert(`You can only upload up to ${maxImages} images`);
            return;
        }

        setUploading(true);
        try {
            const newImages = [];

            for (const file of files) {
                // Validate file type
                if (!file.type.startsWith('image/')) {
                    alert(`${file.name} is not an image file`);
                    continue;
                }

                // Validate file size (max 5MB)
                if (file.size > 5 * 1024 * 1024) {
                    alert(`${file.name} is too large. Maximum size is 5MB`);
                    continue;
                }

                const base64 = await convertToBase64(file);
                newImages.push({
                    id: Date.now() + Math.random(),
                    file,
                    base64,
                    name: file.name,
                    size: file.size
                });
            }

            onImagesChange([...images, ...newImages]);
        } catch (error) {
            console.error('Error uploading images:', error);
            alert('Error uploading images. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);

        const files = Array.from(e.dataTransfer.files);
        handleFileSelect(files);
    };

    const handleFileInput = (e) => {
        const files = Array.from(e.target.files);
        handleFileSelect(files);
    };

    const removeImage = (imageId) => {
        onImagesChange(images.filter(img => img.id !== imageId));
    };

    const openFileDialog = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="space-y-4">
            {/* Upload Area */}
            <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    isDragging
                        ? 'border-primary bg-primary/5'
                        : 'border-muted-foreground/25 hover:border-primary/50'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <div className="space-y-4">
                    {uploading ? (
                        <Loader2 className="w-12 h-12 mx-auto text-muted-foreground animate-spin" />
                    ) : (
                        <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
                    )}
                    <div>
                        <p className="text-lg font-medium">
                            {uploading ? 'Uploading images...' : 'Drop images here or click to browse'}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                            Supports JPG, PNG, GIF up to 5MB each
                        </p>
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={openFileDialog}
                        disabled={uploading || images.length >= maxImages}
                    >
                        <ImageIcon className="w-4 h-4 mr-2" />
                        Choose Images
                    </Button>
                    <p className="text-xs text-muted-foreground">
                        {images.length}/{maxImages} images uploaded
                    </p>
                </div>
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileInput}
                    className="hidden"
                />
            </div>

            {/* Uploaded Images */}
            {images.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-sm font-medium">Uploaded Images</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        <AnimatePresence>
                            {images.map((image) => (
                                <motion.div
                                    key={image.id}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    className="relative group"
                                >
                                    <div className="aspect-square rounded-lg overflow-hidden border bg-muted">
                                        <Image
                                            src={image.base64}
                                            alt={image.name}
                                            width={200}
                                            height={200}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => removeImage(image.id)}
                                    >
                                        <X className="w-3 h-3" />
                                    </Button>
                                    <div className="absolute bottom-2 left-2 right-2">
                                        <p className="text-xs text-white bg-black/50 rounded px-2 py-1 truncate">
                                            {image.name}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            )}
        </div>
    );
}
