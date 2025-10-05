{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = [
    pkgs.curl
    pkgs.nodejs_22
  ];
}
