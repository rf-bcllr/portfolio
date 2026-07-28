interface ContactFooterProps {
  contactTitle?: string;
  contactDescription?: string;
  backToTop?: string;
}

export const ContactFooter = ({}: ContactFooterProps) => {
  return (
    <footer className="border-t py-10 text-center text-sm text-muted-foreground">
      <p>© {new Date().getFullYear()} Rafael Bacellar · All rights reserved</p>
    </footer>
  );
};
