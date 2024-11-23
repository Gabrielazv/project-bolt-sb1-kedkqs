"use client";

import { Card, CardContent } from "@/components/ui/card";
import Image from 'next/image';
import { ExternalLink } from 'lucide-react';

interface ProductCardProps {
  name: string;
  price: string;
  imageUrl: string;
  productUrl: string;
  merchant: string;
}

export default function ProductCard({
  name,
  price,
  imageUrl,
  productUrl,
  merchant
}: ProductCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300">
      <a href={productUrl} target="_blank" rel="noopener noreferrer">
        <CardContent className="p-4">
          <div className="relative w-full h-48 mb-4">
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="rounded-lg object-cover"
            />
          </div>
          <h3 className="font-semibold text-lg mb-2 group-hover:text-teal-600 transition-colors">
            {name}
            <ExternalLink className="inline-block ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </h3>
          <p className="text-green-600 font-bold mb-1">{price}</p>
          <p className="text-sm text-gray-600">{merchant}</p>
        </CardContent>
      </a>
    </Card>
  );
}