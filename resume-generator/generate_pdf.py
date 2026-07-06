import os
import subprocess
import sys

def main():
    edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
    
    if not os.path.exists(edge_path):
        print(f"Error: Microsoft Edge was not found at '{edge_path}'.")
        sys.exit(1)
        
    current_dir = os.path.dirname(os.path.abspath(__file__))
    html_path = os.path.join(current_dir, "resume.html")
    pdf_path = os.path.join(current_dir, "resume.pdf")
    
    if not os.path.exists(html_path):
        print(f"Error: HTML resume not found at '{html_path}'.")
        sys.exit(1)
        
    # Command to run Edge in headless mode and print to PDF
    cmd = [
        edge_path,
        "--headless",
        "--disable-gpu",
        "--no-sandbox",
        "--print-to-pdf-no-header",  # Suppress default headers (page numbers, titles)
        f"--print-to-pdf={pdf_path}",
        html_path
    ]
    
    print(f"Running command: {' '.join(cmd)}")
    
    try:
        result = subprocess.run(cmd, check=True, capture_output=True, text=True)
        if os.path.exists(pdf_path):
            print(f"\nSuccess! PDF generated successfully at:\n{pdf_path}")
            print(f"File size: {os.path.getsize(pdf_path)} bytes")
        else:
            print(f"\nError: Command completed but PDF file was not created at:\n{pdf_path}")
            print("Edge output:", result.stdout, result.stderr)
            sys.exit(1)
    except subprocess.CalledProcessError as e:
        print("\nFailed to generate PDF.")
        print("Exit code:", e.returncode)
        print("Output:", e.output)
        print("Error details:", e.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
