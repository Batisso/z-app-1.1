"use client"

import { Button } from "@/components/ui/button"
import { Plus, Menu } from "lucide-react"


  const Header = () => {
    return (
      <div className="sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3">
          <div className="flex items-center justify-between bg-white/10 backdrop-blur-lg rounded-2xl px-6 py-3 shadow-sm">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="p-2 hover:bg-white/20 rounded-lg lg:hidden"
              >
                <Menu className="w-5 h-5" />
              </Button>
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">Z</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold">
                  Zadulis Ai
                </h1>
                <p className="text-xs opacity-70">Culture Circles</p>
              </div>
            </div>
            <div className="flex gap-3">
            
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 shadow-sm"
                 
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Circle
                  </Button>
              
                  <Button 
                    className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-4 py-2 shadow-sm"
               
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Post
                  </Button>
                
            </div>
          </div>
        </div>
      </div>
    )
  }

  export default Header