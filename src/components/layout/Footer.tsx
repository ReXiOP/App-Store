export function Footer() {
    return (
        <footer className="border-t bg-muted/40">
            <div className="container mx-auto px-4 py-8 md:py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold">AppStore</h3>
                        <p className="text-sm text-muted-foreground">
                            The professional destination for your mobile applications using Next.js.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-medium mb-3">Community</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><a href="#" className="hover:text-primary">About</a></li>
                            <li><a href="#" className="hover:text-primary">Discord</a></li>
                            <li><a href="#" className="hover:text-primary">Twitter</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-medium mb-3">Legal</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><a href="#" className="hover:text-primary">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-primary">Terms of Service</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-medium mb-3">Install</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                            Download our official app manager.
                        </p>
                    </div>
                </div>
                <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
                    &copy; {new Date().getFullYear()} AppStore. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
