import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8">
            <a href="/" className="text-lg font-bold text-primary-600">
              CulturalHeritage
            </a>
            <p className="text-gray-500 text-base">
              Preserving and sharing cultural heritage for future generations.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                  Explore
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <a href="/items" className="text-base text-gray-500 hover:text-gray-900">
                      Collection
                    </a>
                  </li>
                  <li>
                    <a href="/map" className="text-base text-gray-500 hover:text-gray-900">
                      Map
                    </a>
                  </li>
                  <li>
                    <a href="/about" className="text-base text-gray-500 hover:text-gray-900">
                      About
                    </a>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                  Legal
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <a href="/privacy" className="text-base text-gray-500 hover:text-gray-900">
                      Privacy
                    </a>
                  </li>
                  <li>
                    <a href="/terms" className="text-base text-gray-500 hover:text-gray-900">
                      Terms
                    </a>
                  </li>
                  <li>
                    <a href="/contact" className="text-base text-gray-500 hover:text-gray-900">
                      Contact
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-200 pt-8">
          <p className="text-base text-gray-400 xl:text-center">
            &copy; {new Date().getFullYear()} CulturalHeritage. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;