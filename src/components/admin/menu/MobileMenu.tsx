import Link from 'next/link'
import { XIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface MobileMenuProps {
    onClose: () => void
}

export function MobileMenu({ onClose }: MobileMenuProps) {
    return (
        <div className="md:hidden">
            <div className="bg-background border-b">
                <div className="flex items-center justify-between p-4">
                    <h2 className="text-lg font-semibold">Menu</h2>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <XIcon className="h-5 w-5" />
                        <span className="sr-only">Fermer le menu</span>
                    </Button>
                </div>
                <nav className="px-4 py-6">
                    <ul className="space-y-4">
                        <li>
                            <Link href="/about" className="block py-2 text-lg" onClick={onClose}>
                                À propos
                            </Link>
                        </li>
                        <li>
                            <Link href="/products" className="block py-2 text-lg" onClick={onClose}>
                                Produits
                            </Link>
                        </li>
                        <li>
                            <Link href="/contact" className="block py-2 text-lg" onClick={onClose}>
                                Contact
                            </Link>
                        </li>
                    </ul>
                </nav>
                <div className="px-4 py-6 border-t">
                    <Button variant="outline" className="w-full mb-2" onClick={onClose}>
                        Se Connecter
                    </Button>
                    <Button className="w-full" onClick={onClose}>
                        S'Inscrire
                    </Button>
                </div>
            </div>
        </div>
    )
}

