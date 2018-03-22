#include <stdio.h>
#include <uv.h>

int main(int argc, char **argv)
{
    printf("Now quitting.\n");
    uv_run(uv_default_loop(), UV_RUN_DEFAULT);
    return 0;
}