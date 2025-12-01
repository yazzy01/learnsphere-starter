import { BookOpen, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="p-2 rounded-lg bg-gradient-to-r from-primary to-secondary">
                <BookOpen className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold">SmartLearn</h3>
            </div>
            <p className="text-background/70 mb-6">
              Empowering learners worldwide with expert-led courses and cutting-edge educational technology.
            </p>
            <div className="flex space-x-4">
              <Button size="sm" variant="secondary">
                Get Started
              </Button>
            </div>
          </div>

          {/* Courses */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Popular Courses</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-background/70 hover:text-background transition-colors">Web Development</a></li>
              <li><a href="#" className="text-background/70 hover:text-background transition-colors">Data Science</a></li>
              <li><a href="#" className="text-background/70 hover:text-background transition-colors">Digital Marketing</a></li>
              <li><a href="#" className="text-background/70 hover:text-background transition-colors">UI/UX Design</a></li>
              <li><a href="#" className="text-background/70 hover:text-background transition-colors">Cloud Computing</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-background/70 hover:text-background transition-colors">About Us</a></li>
              <li><a href="#" className="text-background/70 hover:text-background transition-colors">Our Team</a></li>
              <li><a href="#" className="text-background/70 hover:text-background transition-colors">Careers</a></li>
              <li><a href="#" className="text-background/70 hover:text-background transition-colors">Contact</a></li>
              <li><a href="#" className="text-background/70 hover:text-background transition-colors">Blog</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Contact Info</h4>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-background/70" />
                <span className="text-background/70">support@smartlearn.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-background/70" />
                <span className="text-background/70">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-background/70 mt-1" />
                <span className="text-background/70">123 Learning Street<br />Education City, EC 12345</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-background/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-background/70 text-sm">
              © 2024 SmartLearn. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-background/70 hover:text-background transition-colors text-sm">
                Privacy Policy
              </a>
              <a href="#" className="text-background/70 hover:text-background transition-colors text-sm">
                Terms of Service
              </a>
              <a href="#" className="text-background/70 hover:text-background transition-colors text-sm">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;