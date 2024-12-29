"use client"
import React from 'react'
import { useAuth } from '@/components/providers/auth-provider';

const EmailBox = () => {
    const { currentUser } = useAuth();

  return (
    <div className="text-center text-muted-foreground text-base">
            Chúng tôi vừa gửi email đến địa chỉ:{" "}
            <strong className="block md:inline">{currentUser?.email}</strong>
          </div>
  )
}

export default EmailBox