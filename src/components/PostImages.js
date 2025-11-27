'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

export default function PostImages({ images }) {
    if (!images || images.length === 0) return null;

    return (
        <div className="space-y-4 my-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {images.map((image, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative group"
                    >
                        <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                            <Image
                                src={image.base64}
                                alt={image.name || `Image ${index + 1}`}
                                width={400}
                                height={225}
                                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                            />
                        </div>
                        {image.name && (
                            <div className="absolute bottom-2 left-2 right-2">
                                <p className="text-xs text-white bg-black/50 rounded px-2 py-1 truncate">
                                    {image.name}
                                </p>
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
