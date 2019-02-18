------------------------------------------------------------------------------
-- "fixed_pkg" package contains functions for fixed point math.
-- Please see the documentation for the fixed point package.
-- This package should be compiled into "ieee_proposed" and used as follows:
-- use ieee.std_logic_1164.all;
-- use ieee.numeric_std.all;
-- use ieee_proposed.fixed_pkg.all;
-- Last Modified: $Date: 2006/05/09 19:21:24 $
-- RCS ID: $Id: fixed_pkg_c.vhd,v 1.1 2006/05/09 19:21:24 sandeepd Exp $
--
--  Created for VHDL-200X par, David Bishop (dbishop@vhdl.org)
-- 
--
--
-- This file has some changes to allow to be able to use fixed-point in
-- conjunction with VHDL2008 
------------------------------------------------------------------------------
library ieee;
use ieee.std_logic_1164.all;
use ieee.numeric_std.all;
-- synthesis translate_off
use std.textio.all;
-- synthesis translate_on

package fixed_pkg is
  --%%% Uncomment the Generics
--  new work.fixed_generic_pkg
--  generic map (
--    fixed_round_style    => true;  -- fixed_round
--    fixed_overflow_style => true;  -- fixed_saturate
--    fixed_guard_bits     => 3;     -- number of guard bits
--    no_warning           => false  -- show warnings
--    );
  --%%% REMOVE THE REST OF THIS FILE.
  constant fixed_round_style    : BOOLEAN := true;  -- round
  constant fixed_overflow_style : BOOLEAN := true;  -- saturate
  constant fixed_guard_bits     : NATURAL := 3;     -- number of guard bits
  constant no_warning           : BOOLEAN := false; -- issue warnings
  -- Author David Bishop (dbishop@vhdl.org)
  -- These 5 constants are used as defaults.
  -- There is a mechanism to override them in every function
  constant fixed_round        : BOOLEAN := true;   -- Turn on rounding routine
  constant fixed_truncate     : BOOLEAN := false;  -- Trun off rounding routine
  constant fixed_saturate     : BOOLEAN := true;   -- Saturate large numbers
  constant fixed_wrap         : BOOLEAN := false;  -- Wrap large numbers
  constant fixedsynth_or_real : BOOLEAN;           -- differed constant
  -- base Unsigned fixed point type, downto direction assumed
  type     ufixed is array (INTEGER range <>) of STD_LOGIC;
  -- base Signed fixed point type, downto direction assumed
  type     sfixed is array (INTEGER range <>) of STD_LOGIC;
  -----------------------------------------------------------------------------
  -- Fixed point type is defined as follows:
  -- 0000000000
  -- 4321012345
  -- 4   0   -5
  -- The decimal point is assumed between the "0" and "-1" index
  -- Thus "0011010000" = 6.5 and would be written as 00110.10000
  -- All types are assumed to be in the "downto" direction.

  --===========================================================================
  -- Arithmetic Operators:
  --===========================================================================
  -- Modify the sign of the number, 2's complement
  function "abs" (arg : sfixed) return sfixed;
  function "-" (arg   : sfixed)return sfixed;

  -- Convert a signed fixed to an unsigned fixed
  function "abs" (arg : sfixed) return ufixed;

  -- Addition
  -- ufixed(a downto b) + ufixed(c downto d)
  --   = ufixed(max(a,c)+1 downto min(b,d))
  function "+" (l, r : ufixed) return ufixed;

  -- sfixed(a downto b) + sfixed(c downto d)
  --   = sfixed(max(a,c)+1 downto min(b,d))
  function "+" (l, r : sfixed) return sfixed;

  -- Subtraction
  -- ufixed(a downto b) - ufixed(c downto d)
  --   = ufixed(max(a,c)+1 downto min(b,d))
  function "-" (l, r : ufixed) return ufixed;

  -- sfixed(a downto b) - sfixed(c downto d)
  --   = sfixed(max(a,c)+1 downto min(b,d))
  function "-" (l, r : sfixed) return sfixed;

  -- Multiplication
  -- ufixed(a downto b) * ufixed(c downto d) = ufixed(a+c+1 downto b+d)
  function "*" (l, r : ufixed) return ufixed;

  -- sfixed(a downto b) * sfixed(c downto d) = sfixed(a+c+1 downto b+d)
  function "*" (l, r : sfixed) return sfixed;

  -- Division
  -- ufixed(a downto b) / ufixed(c downto d) = ufixed(a-d downto b-c-1)
  function "/" (l, r : ufixed) return ufixed;

  -- sfixed(a downto b) / sfixed(c downto d) = sfixed(a-d+1 downto b-c)
  function "/" (l, r : sfixed) return sfixed;

  -- Remainder
  -- ufixed (a downto b) rem ufixed (c downto d)
  --   = ufixed (min(a,c) downto min(b,d))
  function "rem" (l, r : ufixed) return ufixed;

  -- sfixed (a downto b) rem sfixed (c downto d)
  --   = sfixed (min(a,c) downto min(b,d))
  function "rem" (l, r : sfixed) return sfixed;

  -- Modulo
  -- ufixed (a downto b) mod ufixed (c downto d)
  --        = ufixed (min(a,c) downto min(b, d))
  function "mod" (l, r : ufixed) return ufixed;

  -- sfixed (a downto b) mod sfixed (c downto d)
  --        = sfixed (c downto min(b, d))
  function "mod" (l, r : sfixed) return sfixed;

  ----------------------------------------------------------------------------
  -- Overload routines.  In these routines the "real" or "natural" (integer)
  -- are converted into a fixed point number and then the operation is
  -- performed.  It is assumed that the array will be large enough.
  -- If the input is "real" then the real number is converted into a fixed of
  -- the same size as the fixed point input.  If the number is an "integer"
  -- then it is converted into fixed with the range (l'high downto 0).
  ----------------------------------------------------------------------------
  -- ufixed(a downto b) + ufixed(a downto b) = ufixed(a+1 downto b)
  function "+" (l : ufixed; r : REAL) return ufixed;

  -- ufixed(c downto d) + ufixed(c downto d) = ufixed(c+1 downto d)
  function "+" (l : REAL; r : ufixed) return ufixed;

  -- ufixed(a downto b) + ufixed(a downto 0) = ufixed(a+1 downto min(0,b))
  function "+" (l : ufixed; r : NATURAL) return ufixed;

  -- ufixed(a downto 0) + ufixed(c downto d) = ufixed(c+1 downto min(0,d))
  function "+" (l : NATURAL; r : ufixed) return ufixed;

  -- ufixed(a downto b) - ufixed(a downto b) = ufixed(a+1 downto b)
  function "-" (l : ufixed; r : REAL) return ufixed;

  -- ufixed(c downto d) - ufixed(c downto d) = ufixed(c+1 downto d)
  function "-" (l : REAL; r : ufixed) return ufixed;

  -- ufixed(a downto b) - ufixed(a downto 0) = ufixed(a+1 downto min(0,b))
  function "-" (l : ufixed; r : NATURAL) return ufixed;

  -- ufixed(a downto 0) + ufixed(c downto d) = ufixed(c+1 downto min(0,d))
  function "-" (l : NATURAL; r : ufixed) return ufixed;

  -- ufixed(a downto b) * ufixed(a downto b) = ufixed(2a+1 downto 2b)
  function "*" (l : ufixed; r : REAL) return ufixed;

  -- ufixed(c downto d) * ufixed(c downto d) = ufixed(2c+1 downto 2d)
  function "*" (l : REAL; r : ufixed) return ufixed;

  -- ufixed (a downto b) * ufixed (a downto 0) = ufixed (2a+1 downto b)
  function "*" (l : ufixed; r : NATURAL) return ufixed;

  -- ufixed (a downto b) * ufixed (a downto 0) = ufixed (2a+1 downto b)
  function "*" (l : NATURAL; r : ufixed) return ufixed;

  -- ufixed(a downto b) / ufixed(a downto b) = ufixed(a-b downto b-a-1)
  function "/" (l : ufixed; r : REAL) return ufixed;

  -- ufixed(a downto b) / ufixed(a downto b) = ufixed(a-b downto b-a-1)
  function "/" (l : REAL; r : ufixed) return ufixed;

  -- ufixed(a downto b) / ufixed(a downto 0) = ufixed(a downto b-a-1)
  function "/" (l : ufixed; r : NATURAL) return ufixed;

  -- ufixed(c downto 0) / ufixed(c downto d) = ufixed(c-d downto -c-1)
  function "/" (l : NATURAL; r : ufixed) return ufixed;

  -- ufixed (a downto b) rem ufixed (a downto b) = ufixed (a downto b)
  function "rem" (l : ufixed; r : REAL) return ufixed;

  -- ufixed (c downto d) rem ufixed (c downto d) = ufixed (c downto d)
  function "rem" (l : REAL; r : ufixed) return ufixed;

  -- ufixed (a downto b) rem ufixed (a downto 0) = ufixed (a downto min(b,0))
  function "rem" (l : ufixed; r : NATURAL) return ufixed;

  -- ufixed (c downto 0) rem ufixed (c downto d) = ufixed (c downto min(d,0))
  function "rem" (l : NATURAL; r : ufixed) return ufixed;

  -- ufixed (a downto b) mod ufixed (a downto b) = ufixed (a downto b)
  function "mod" (l : ufixed; r : REAL) return ufixed;

  -- ufixed (c downto d) mod ufixed (c downto d) = ufixed (c downto d)
  function "mod" (l : REAL; r : ufixed) return ufixed;

  -- ufixed (a downto b) mod ufixed (a downto 0) = ufixed (a downto min(b,0))
  function "mod" (l : ufixed; r : NATURAL) return ufixed;

  -- ufixed (c downto 0) mod ufixed (c downto d) = ufixed (c downto min(d,0))
  function "mod" (l : NATURAL; r : ufixed) return ufixed;

  -- sfixed(a downto b) + sfixed(a downto b) = sfixed(a+1 downto b)
  function "+" (l : sfixed; r : REAL) return sfixed;

  -- sfixed(c downto d) + sfixed(c downto d) = sfixed(c+1 downto d)
  function "+" (l : REAL; r : sfixed) return sfixed;

  -- sfixed(a downto b) + sfixed(a downto 0) = sfixed(a+1 downto min(0,b))
  function "+" (l : sfixed; r : INTEGER) return sfixed;

  -- sfixed(c downto 0) + sfixed(c downto d) = sfixed(c+1 downto min(0,d))
  function "+" (l : INTEGER; r : sfixed) return sfixed;

  -- sfixed(a downto b) - sfixed(a downto b) = sfixed(a+1 downto b)
  function "-" (l : sfixed; r : REAL) return sfixed;

  -- sfixed(c downto d) - sfixed(c downto d) = sfixed(c+1 downto d)
  function "-" (l : REAL; r : sfixed) return sfixed;

  -- sfixed(a downto b) - sfixed(a downto 0) = sfixed(a+1 downto min(0,b))
  function "-" (l : sfixed; r : INTEGER) return sfixed;

  -- sfixed(c downto 0) - sfixed(c downto d) = sfixed(c+1 downto min(0,d))
  function "-" (l : INTEGER; r : sfixed) return sfixed;

  -- sfixed(a downto b) * sfixed(a downto b) = sfixed(2a+1 downto 2b)
  function "*" (l : sfixed; r : REAL) return sfixed;

  -- sfixed(c downto d) * sfixed(c downto d) = sfixed(2c+1 downto 2d)
  function "*" (l : REAL; r : sfixed) return sfixed;

  -- sfixed(a downto b) * sfixed(a downto 0) = sfixed(2a+1 downto b)
  function "*" (l : sfixed; r : INTEGER) return sfixed;

  -- sfixed(c downto 0) * sfixed(c downto d) = sfixed(2c+1 downto d)
  function "*" (l : INTEGER; r : sfixed) return sfixed;

  -- sfixed(a downto b) / sfixed(a downto b) = sfixed(a-b+1 downto b-a)
  function "/" (l : sfixed; r : REAL) return sfixed;

  -- sfixed(c downto d) / sfixed(c downto d) = sfixed(c-d+1 downto d-c)
  function "/" (l : REAL; r : sfixed) return sfixed;

  -- sfixed(a downto b) / sfixed(a downto 0) = sfixed(a+1 downto b-a)
  function "/" (l : sfixed; r : INTEGER) return sfixed;

  -- sfixed(c downto 0) / sfixed(c downto d) = sfixed(c-d+1 downto -c)
  function "/" (l : INTEGER; r : sfixed) return sfixed;

  -- sfixed (a downto b) rem sfixed (a downto b) = sfixed (a downto b)
  function "rem" (l : sfixed; r : REAL) return sfixed;

  -- sfixed (c downto d) rem sfixed (c downto d) = sfixed (c downto d)
  function "rem" (l : REAL; r : sfixed) return sfixed;

  -- sfixed (a downto b) rem sfixed (a downto 0) = sfixed (a downto min(b,0))
  function "rem" (l : sfixed; r : INTEGER) return sfixed;

  -- sfixed (c downto 0) rem sfixed (c downto d) = sfixed (c downto min(d,0))
  function "rem" (l : INTEGER; r : sfixed) return sfixed;

  -- sfixed (a downto b) mod sfixed (a downto b) = sfixed (a downto b)
  function "mod" (l : sfixed; r : REAL) return sfixed;

  -- sfixed (c downto d) mod sfixed (c downto d) = sfixed (c downto d)
  function "mod" (l : REAL; r : sfixed) return sfixed;

  -- sfixed (a downto b) mod sfixed (a downto 0) = sfixed (a downto min(b,0))
  function "mod" (l : sfixed; r : INTEGER) return sfixed;

  -- sfixed (c downto 0) mod sfixed (c downto d) = sfixed (c downto min(d,0))
  function "mod" (l : INTEGER; r : sfixed) return sfixed;

  -- This version of divide gives the user more control
  -- ufixed(a downto b) / ufixed(c downto d) = ufixed(a-d downto b-c-1)
  function divide (
    l, r                 : ufixed;
    constant round_style : BOOLEAN := fixed_round_style;
    constant guard_bits  : NATURAL := fixed_guard_bits)
    return ufixed;

  -- This version of divide gives the user more control
  -- sfixed(a downto b) / sfixed(c downto d) = sfixed(a-d+1 downto b-c)
  function divide (
    l, r                 : sfixed;
    constant round_style : BOOLEAN := fixed_round_style;
    constant guard_bits  : NATURAL := fixed_guard_bits)
    return sfixed;

  -- These functions return 1/X
  -- 1 / ufixed(a downto b) = ufixed(-b downto -a-1)
  function reciprocal (
    arg                  : ufixed;      -- fixed point input
    constant round_style : BOOLEAN := fixed_round_style;
    constant guard_bits  : NATURAL := fixed_guard_bits)
    return ufixed;

  -- 1 / sfixed(a downto b) = sfixed(-b+1 downto -a)
  function reciprocal (
    arg                  : sfixed;      -- fixed point input
    constant round_style : BOOLEAN := fixed_round_style;
    constant guard_bits  : NATURAL := fixed_guard_bits)
    return sfixed;

  -- REM function
  -- ufixed (a downto b) rem ufixed (c downto d)
  --   = ufixed (min(a,c) downto min(b,d))
  function remainder (
    l, r                 : ufixed;
    constant round_style : BOOLEAN := fixed_round_style)
    return ufixed;

  -- sfixed (a downto b) rem sfixed (c downto d)
  --   = sfixed (min(a,c) downto min(b,d))
  function remainder (
    l, r                 : sfixed;
    constant round_style : BOOLEAN := fixed_round_style)
    return sfixed;

  -- mod function
  -- ufixed (a downto b) mod ufixed (c downto d)
  --        = ufixed (min(a,c) downto min(b, d))
  function modulo (
    l, r                 : ufixed;
    constant round_style : BOOLEAN := fixed_round_style)
    return ufixed;

  -- sfixed (a downto b) mod sfixed (c downto d)
  --        = sfixed (c downto min(b, d))
  function modulo (
    l, r                    : sfixed;
    constant overflow_style : BOOLEAN := fixed_overflow_style;
    constant round_style    : BOOLEAN := fixed_round_style)
    return sfixed;

  -- Procedure for those who need an "accumulator" function.
  -- add_carry (ufixed(a downto b), ufixed (c downto d))
  --         = ufixed (max(a,c) downto min(b,d))
  procedure add_carry (
    L, R   : in  ufixed;
    c_in   : in  STD_ULOGIC;
    result : out ufixed;
    c_out  : out STD_ULOGIC);

  -- add_carry (sfixed(a downto b), sfixed (c downto d))
  --         = sfixed (max(a,c) downto min(b,d))
  procedure add_carry (
    L, R   : in  sfixed;
    c_in   : in  STD_ULOGIC;
    result : out sfixed;
    c_out  : out STD_ULOGIC);

  -- Scales the result by a power of 2.  Width of input = width of output with
  -- the decimal point moved.
  function scalb (y : ufixed; N : integer) return ufixed;
  function scalb (y : ufixed; N : SIGNED) return ufixed;
  function scalb (y : sfixed; N : integer) return sfixed;
  function scalb (y : sfixed; N : SIGNED) return sfixed;

  function Is_Negative (arg : sfixed) return BOOLEAN;
  --===========================================================================
  -- Comparison Operators
  --===========================================================================
  function ">" (l, r    : ufixed) return BOOLEAN;
  function ">" (l, r    : sfixed) return BOOLEAN;
  function "<" (l, r    : ufixed) return BOOLEAN;
  function "<" (l, r    : sfixed) return BOOLEAN;
  function "<=" (l, r   : ufixed) return BOOLEAN;
  function "<=" (l, r   : sfixed) return BOOLEAN;
  function ">=" (l, r   : ufixed) return BOOLEAN;
  function ">=" (l, r   : sfixed) return BOOLEAN;
  function "=" (l, r    : ufixed) return BOOLEAN;
  function "=" (l, r    : sfixed) return BOOLEAN;
  function "/=" (l, r   : ufixed) return BOOLEAN;
  function "/=" (l, r   : sfixed) return BOOLEAN;
  --%%% Uncomment the following (new syntax)
--  function "?=" (L, R : ufixed) return BOOLEAN;
--  function "?=" (L, R : sfixed) return BOOLEAN;
--  --%%% remove the following (old syntax)
  function \?=\ (L, R : ufixed) return STD_ULOGIC;
  function \?=\ (L, R : sfixed) return STD_ULOGIC;
  -- These need to be overloaded for sfixed and ufixed
  function \?/=\ (L, R : ufixed) return STD_ULOGIC;
  function \?>\  (L, R : ufixed) return STD_ULOGIC;
  function \?>=\ (L, R : ufixed) return STD_ULOGIC;
  function \?<\  (L, R : ufixed) return STD_ULOGIC;
  function \?<=\ (L, R : ufixed) return STD_ULOGIC;
  function \?/=\ (L, R : sfixed) return STD_ULOGIC;
  function \?>\  (L, R : sfixed) return STD_ULOGIC;
  function \?>=\ (L, R : sfixed) return STD_ULOGIC;
  function \?<\  (L, R : sfixed) return STD_ULOGIC;
  function \?<=\ (L, R : sfixed) return STD_ULOGIC;
  -- %%% Replace with the following (new syntax)
--  function "?="  (L, R : ufixed) return STD_ULOGIC;
--  function "?/=" (L, R : ufixed) return STD_ULOGIC;
--  function "?>"  (L, R : ufixed) return STD_ULOGIC;
--  function "?>=" (L, R : ufixed) return STD_ULOGIC;
--  function "?<"  (L, R : ufixed) return STD_ULOGIC;
--  function "?<=" (L, R : ufixed) return STD_ULOGIC;
--  function "?="  (L, R : sfixed) return STD_ULOGIC;
--  function "?/=" (L, R : sfixed) return STD_ULOGIC;
--  function "?>"  (L, R : sfixed) return STD_ULOGIC;
--  function "?>=" (L, R : sfixed) return STD_ULOGIC;
--  function "?<"  (L, R : sfixed) return STD_ULOGIC;
--  function "?<=" (L, R : sfixed) return STD_ULOGIC;

  function std_match (L, R : ufixed) return BOOLEAN;
  function std_match (L, R : sfixed) return BOOLEAN;

  -- Overloads the default "maximum" and "minimum" function
  function maximum (l, r : ufixed) return ufixed;
  function minimum (l, r : ufixed) return ufixed;
  function maximum (l, r : sfixed) return sfixed;
  function minimum (l, r : sfixed) return sfixed;

  ----------------------------------------------------------------------------
  -- In these compare functions a natural is converted into a
  -- fixed point number of the bounds "max(l'high,0) downto 0"
  ----------------------------------------------------------------------------
  function "=" (l  : ufixed; r : NATURAL) return BOOLEAN;
  function "/=" (l : ufixed; r : NATURAL) return BOOLEAN;
  function ">=" (l : ufixed; r : NATURAL) return BOOLEAN;
  function "<=" (l : ufixed; r : NATURAL) return BOOLEAN;
  function ">" (l  : ufixed; r : NATURAL) return BOOLEAN;
  function "<" (l  : ufixed; r : NATURAL) return BOOLEAN;

  function "=" (l  : NATURAL; r : ufixed) return BOOLEAN;
  function "/=" (l : NATURAL; r : ufixed) return BOOLEAN;
  function ">=" (l : NATURAL; r : ufixed) return BOOLEAN;
  function "<=" (l : NATURAL; r : ufixed) return BOOLEAN;
  function ">" (l  : NATURAL; r : ufixed) return BOOLEAN;
  function "<" (l  : NATURAL; r : ufixed) return BOOLEAN;

  ----------------------------------------------------------------------------
  -- In these compare functions a real is converted into a
  -- fixed point number of the bounds "l'high+1 downto l'low"
  ----------------------------------------------------------------------------
  function "=" (l  : ufixed; r : REAL) return BOOLEAN;
  function "/=" (l : ufixed; r : REAL) return BOOLEAN;
  function ">=" (l : ufixed; r : REAL) return BOOLEAN;
  function "<=" (l : ufixed; r : REAL) return BOOLEAN;
  function ">" (l  : ufixed; r : REAL) return BOOLEAN;
  function "<" (l  : ufixed; r : REAL) return BOOLEAN;

  function "=" (l  : REAL; r : ufixed) return BOOLEAN;
  function "/=" (l : REAL; r : ufixed) return BOOLEAN;
  function ">=" (l : REAL; r : ufixed) return BOOLEAN;
  function "<=" (l : REAL; r : ufixed) return BOOLEAN;
  function ">" (l  : REAL; r : ufixed) return BOOLEAN;
  function "<" (l  : REAL; r : ufixed) return BOOLEAN;

  ----------------------------------------------------------------------------
  -- In these compare functions an integer is converted into a
  -- fixed point number of the bounds "max(l'high,1) downto 0"
  ----------------------------------------------------------------------------
  function "=" (l  : sfixed; r : INTEGER) return BOOLEAN;
  function "/=" (l : sfixed; r : INTEGER) return BOOLEAN;
  function ">=" (l : sfixed; r : INTEGER) return BOOLEAN;
  function "<=" (l : sfixed; r : INTEGER) return BOOLEAN;
  function ">" (l  : sfixed; r : INTEGER) return BOOLEAN;
  function "<" (l  : sfixed; r : INTEGER) return BOOLEAN;

  function "=" (l  : INTEGER; r : sfixed) return BOOLEAN;
  function "/=" (l : INTEGER; r : sfixed) return BOOLEAN;
  function ">=" (l : INTEGER; r : sfixed) return BOOLEAN;
  function "<=" (l : INTEGER; r : sfixed) return BOOLEAN;
  function ">" (l  : INTEGER; r : sfixed) return BOOLEAN;
  function "<" (l  : INTEGER; r : sfixed) return BOOLEAN;

  ----------------------------------------------------------------------------
  -- In these compare functions a real is converted into a
  -- fixed point number of the bounds "l'high+1 downto l'low"
  ----------------------------------------------------------------------------
  function "=" (l  : sfixed; r : REAL) return BOOLEAN;
  function "/=" (l : sfixed; r : REAL) return BOOLEAN;
  function ">=" (l : sfixed; r : REAL) return BOOLEAN;
  function "<=" (l : sfixed; r : REAL) return BOOLEAN;
  function ">" (l  : sfixed; r : REAL) return BOOLEAN;
  function "<" (l  : sfixed; r : REAL) return BOOLEAN;

  function "=" (l  : REAL; r : sfixed) return BOOLEAN;
  function "/=" (l : REAL; r : sfixed) return BOOLEAN;
  function ">=" (l : REAL; r : sfixed) return BOOLEAN;
  function "<=" (l : REAL; r : sfixed) return BOOLEAN;
  function ">" (l  : REAL; r : sfixed) return BOOLEAN;
  function "<" (l  : REAL; r : sfixed) return BOOLEAN;

  --===========================================================================
  -- Shift and Rotate Functions.
  -- Note that sra and sla are not the same as the BIT_VECTOR version
  --===========================================================================
  function "sll" (ARG       : ufixed; COUNT : INTEGER) return ufixed;
  function "srl" (ARG       : ufixed; COUNT : INTEGER) return ufixed;
  function "rol" (ARG       : ufixed; COUNT : INTEGER) return ufixed;
  function "ror" (ARG       : ufixed; COUNT : INTEGER) return ufixed;
  function "sla" (ARG       : ufixed; COUNT : INTEGER) return ufixed;
  function "sra" (ARG       : ufixed; COUNT : INTEGER) return ufixed;
  function "sll" (ARG       : sfixed; COUNT : INTEGER) return sfixed;
  function "srl" (ARG       : sfixed; COUNT : INTEGER) return sfixed;
  function "rol" (ARG       : sfixed; COUNT : INTEGER) return sfixed;
  function "ror" (ARG       : sfixed; COUNT : INTEGER) return sfixed;
  function "sla" (ARG       : sfixed; COUNT : INTEGER) return sfixed;
  function "sra" (ARG       : sfixed; COUNT : INTEGER) return sfixed;
  function SHIFT_LEFT (ARG  : ufixed; COUNT : NATURAL) return ufixed;
  function SHIFT_RIGHT (ARG : ufixed; COUNT : NATURAL) return ufixed;
  function SHIFT_LEFT (ARG  : sfixed; COUNT : NATURAL) return sfixed;
  function SHIFT_RIGHT (ARG : sfixed; COUNT : NATURAL) return sfixed;

  ----------------------------------------------------------------------------
  -- logical functions
  ----------------------------------------------------------------------------
  function "not" (L     : ufixed) return ufixed;
  function "and" (L, R  : ufixed) return ufixed;
  function "or" (L, R   : ufixed) return ufixed;
  function "nand" (L, R : ufixed) return ufixed;
  function "nor" (L, R  : ufixed) return ufixed;
  function "xor" (L, R  : ufixed) return ufixed;
  function "xnor" (L, R : ufixed) return ufixed;
  function "not" (L     : sfixed) return sfixed;
  function "and" (L, R  : sfixed) return sfixed;
  function "or" (L, R   : sfixed) return sfixed;
  function "nand" (L, R : sfixed) return sfixed;
  function "nor" (L, R  : sfixed) return sfixed;
  function "xor" (L, R  : sfixed) return sfixed;
  function "xnor" (L, R : sfixed) return sfixed;

  -- Vector and std_ulogic functions, same as functions in numeric_std
  function "and" (L  : STD_ULOGIC; R : ufixed) return ufixed;
  function "and" (L  : ufixed; R : STD_ULOGIC) return ufixed;
  function "or" (L   : STD_ULOGIC; R : ufixed) return ufixed;
  function "or" (L   : ufixed; R : STD_ULOGIC) return ufixed;
  function "nand" (L : STD_ULOGIC; R : ufixed) return ufixed;
  function "nand" (L : ufixed; R : STD_ULOGIC) return ufixed;
  function "nor" (L  : STD_ULOGIC; R : ufixed) return ufixed;
  function "nor" (L  : ufixed; R : STD_ULOGIC) return ufixed;
  function "xor" (L  : STD_ULOGIC; R : ufixed) return ufixed;
  function "xor" (L  : ufixed; R : STD_ULOGIC) return ufixed;
  function "xnor" (L : STD_ULOGIC; R : ufixed) return ufixed;
  function "xnor" (L : ufixed; R : STD_ULOGIC) return ufixed;
  function "and" (L  : STD_ULOGIC; R : sfixed) return sfixed;
  function "and" (L  : sfixed; R : STD_ULOGIC) return sfixed;
  function "or" (L   : STD_ULOGIC; R : sfixed) return sfixed;
  function "or" (L   : sfixed; R : STD_ULOGIC) return sfixed;
  function "nand" (L : STD_ULOGIC; R : sfixed) return sfixed;
  function "nand" (L : sfixed; R : STD_ULOGIC) return sfixed;
  function "nor" (L  : STD_ULOGIC; R : sfixed) return sfixed;
  function "nor" (L  : sfixed; R : STD_ULOGIC) return sfixed;
  function "xor" (L  : STD_ULOGIC; R : sfixed) return sfixed;
  function "xor" (L  : sfixed; R : STD_ULOGIC) return sfixed;
  function "xnor" (L : STD_ULOGIC; R : sfixed) return sfixed;
  function "xnor" (L : sfixed; R : STD_ULOGIC) return sfixed;

  -- Reduction operators, same as numeric_std functions
  -- %%% remove 12 functions (old syntax)
  function and_reduce(arg  : ufixed) return STD_ULOGIC;
  function nand_reduce(arg : ufixed) return STD_ULOGIC;
  function or_reduce(arg   : ufixed) return STD_ULOGIC;
  function nor_reduce(arg  : ufixed) return STD_ULOGIC;
  function xor_reduce(arg  : ufixed) return STD_ULOGIC;
  function xnor_reduce(arg : ufixed) return STD_ULOGIC;
  function and_reduce(arg  : sfixed) return STD_ULOGIC;
  function nand_reduce(arg : sfixed) return STD_ULOGIC;
  function or_reduce(arg   : sfixed) return STD_ULOGIC;
  function nor_reduce(arg  : sfixed) return STD_ULOGIC;
  function xor_reduce(arg  : sfixed) return STD_ULOGIC;
  function xnor_reduce(arg : sfixed) return STD_ULOGIC;
  -- %%% Uncomment the following 12 functions (new syntax)
  -- function "and" ( arg  : ufixed ) RETURN std_ulogic;
  -- function "nand" ( arg  : ufixed ) RETURN std_ulogic;
  -- function "or" ( arg  : ufixed ) RETURN std_ulogic;
  -- function "nor" ( arg  : ufixed ) RETURN std_ulogic;
  -- function "xor" ( arg  : ufixed ) RETURN std_ulogic;
  -- function "xnor" ( arg  : ufixed ) RETURN std_ulogic;
  -- function "and" ( arg  : sfixed ) RETURN std_ulogic;
  -- function "nand" ( arg  : sfixed ) RETURN std_ulogic;
  -- function "or" ( arg  : sfixed ) RETURN std_ulogic;
  -- function "nor" ( arg  : sfixed ) RETURN std_ulogic;
  -- function "xor" ( arg  : sfixed ) RETURN std_ulogic;
  -- function "xnor" ( arg  : sfixed ) RETURN std_ulogic;

  -- returns arg'low-1 if not found
  function find_msb (arg : ufixed; y : STD_ULOGIC) return INTEGER;
  function find_msb (arg : sfixed; y : STD_ULOGIC) return INTEGER;

  -- returns arg'high+1 if not found
  function find_lsb (arg : ufixed; y : STD_ULOGIC) return INTEGER;
  function find_lsb (arg : sfixed; y : STD_ULOGIC) return INTEGER;

  --===========================================================================
  --   RESIZE Functions
  --===========================================================================
  -- resizes the number (larger or smaller)
  -- The returned result will be ufixed (left_index downto right_index)
  -- If "round_style" is true, then the result will be rounded.  If the MSB
  -- of the remainder is a "1" AND the LSB of the unround result is a '1' or
  -- the lower bits of the remainder include a '1' then the result will be
  -- increased by the smallest representable number for that type.
  -- The default is "true" for round_style.
  -- "overflow_style" can be "true" (saturate mode) or "false" (wrap mode).
  -- In saturate mode, if the number overflows then the largest possible
  -- representable number is returned.  If wrap mode, then the upper bits
  -- of the number are truncated.
  function resize (
    arg                     : ufixed;   -- input
    constant left_index     : INTEGER;  -- integer portion
    constant right_index    : INTEGER;  -- size of fraction
    constant overflow_style : BOOLEAN := fixed_overflow_style;  -- overflow
    constant round_style    : BOOLEAN := fixed_round_style)     -- rounding
    return ufixed;

  -- "size_res" functions create the size of the output from the length
  -- of the "size_res" input.  The actual value of "size_res" is not used.
  function resize (
    arg                     : ufixed;                           -- input
    size_res                : ufixed;                           -- for size only
    constant overflow_style : BOOLEAN := fixed_overflow_style;  -- overflow
    constant round_style    : BOOLEAN := fixed_round_style)     -- rounding
    return ufixed;

  -- Note that in "wrap" mode the sign bit is not replicated.  Thus the
  -- resize of a negative number can have a positive result in wrap mode.
  function resize (
    arg                     : sfixed;   -- input
    constant left_index     : INTEGER;  -- integer portion
    constant right_index    : INTEGER;  -- size of fraction
    constant overflow_style : BOOLEAN := fixed_overflow_style;  -- saturate by default
    constant round_style    : BOOLEAN := fixed_round_style)  -- rounding by default
    return sfixed;

  function resize (
    arg                     : sfixed;   -- input
    size_res                : sfixed;   -- for size only
    constant overflow_style : BOOLEAN := fixed_overflow_style;  -- saturate by default
    constant round_style    : BOOLEAN := fixed_round_style)  -- rounding by default
    return sfixed;

  --===========================================================================
  -- Conversion Functions
  --===========================================================================
  -- integer (natural) to unsigned fixed point.
  -- arguments are the upper and lower bounds of the number, thus
  -- ufixed (7 downto -3) <= to_ufixed (int, 7, -3);
  function to_ufixed (
    arg                     : NATURAL;  -- integer
    constant left_index     : INTEGER;  -- size of integer portion
    constant right_index    : INTEGER := 0;                  -- size of fraction
    constant overflow_style : BOOLEAN := fixed_overflow_style;  -- saturate by default
    constant round_style    : BOOLEAN := fixed_round_style)  -- turn on rounding
    return ufixed;

  function to_ufixed (
    arg                     : NATURAL;  -- integer
    size_res                : ufixed;   -- for size only
    constant overflow_style : BOOLEAN := fixed_overflow_style;  -- saturate by default
    constant round_style    : BOOLEAN := fixed_round_style)  -- turn on rounding
    return ufixed;

  -- real to unsigned fixed point
  function to_ufixed (
    arg                     : REAL;     -- real
    constant left_index     : INTEGER;  -- size of integer portion
    constant right_index    : INTEGER;  -- size of fraction
    constant overflow_style : BOOLEAN := fixed_overflow_style;  -- saturate by default
    constant round_style    : BOOLEAN := fixed_round_style;  -- rounding by default
    constant guard_bits     : NATURAL := fixed_guard_bits)   -- # of guard bits
    return ufixed;

  function to_ufixed (
    arg                     : REAL;     -- real
    size_res                : ufixed;   -- for size only
    constant overflow_style : BOOLEAN := fixed_overflow_style;  -- saturate by default
    constant round_style    : BOOLEAN := fixed_round_style;  -- rounding by default
    constant guard_bits     : NATURAL := fixed_guard_bits)   -- # of guard bits
    return ufixed;

  -- unsigned to unsigned fixed point
  function to_ufixed (
    arg                     : UNSIGNED;                      -- unsigned
    constant left_index     : INTEGER;  -- size of integer portion
    constant right_index    : INTEGER := 0;                  -- size of fraction
    constant overflow_style : BOOLEAN := fixed_overflow_style;  -- saturate by default
    constant round_style    : BOOLEAN := fixed_round_style)  -- rounding by default
    return ufixed;

  function to_ufixed (
    arg                     : UNSIGNED;                      -- unsigned
    size_res                : ufixed;   -- for size only
    constant overflow_style : BOOLEAN := fixed_overflow_style;  -- saturate by default
    constant round_style    : BOOLEAN := fixed_round_style)  -- rounding by default
    return ufixed;

  -- Performs a casting.  ufixed (arg'range) is returned
  function to_ufixed (
    arg : UNSIGNED)                     -- unsigned
    return ufixed;

  -- unsigned fixed point to unsigned
  function to_unsigned (
    arg                     : ufixed;   -- fixed point input
    constant size           : NATURAL;  -- length of output
    constant overflow_style : BOOLEAN := fixed_overflow_style;  -- saturate by default
    constant round_style    : BOOLEAN := fixed_round_style)  -- rounding by default
    return UNSIGNED;

  -- unsigned fixed point to unsigned
  function to_unsigned (
    arg                     : ufixed;   -- fixed point input
    size_res                : UNSIGNED;  -- used for length of output
    constant overflow_style : BOOLEAN := fixed_overflow_style;  -- saturate by default
    constant round_style    : BOOLEAN := fixed_round_style)  -- rounding by default
    return UNSIGNED;

  -- unsigned fixed point to real
  function to_real (
    arg : ufixed)                       -- fixed point input
    return REAL;

  -- unsigned fixed point to integer
  function to_integer (
    arg                     : ufixed;   -- fixed point input
    constant overflow_style : BOOLEAN := fixed_overflow_style;  -- saturate by default
    constant round_style    : BOOLEAN := fixed_round_style)  -- rounding by default
    return NATURAL;

  -- Integer to sfixed
  function to_sfixed (
    arg                     : INTEGER;  -- integer
    constant left_index     : INTEGER;  -- size of integer portion
    constant right_index    : INTEGER := 0;                  -- size of fraction
    constant overflow_style : BOOLEAN := fixed_overflow_style;  -- saturate by default
    constant round_style    : BOOLEAN := fixed_round_style)  -- rounding by default
    return sfixed;

  function to_sfixed (
    arg                     : INTEGER;  -- integer
    size_res                : sfixed;   -- for size only
    constant overflow_style : BOOLEAN := fixed_overflow_style;  -- saturate by default
    constant round_style    : BOOLEAN := fixed_round_style)  -- rounding by default
    return sfixed;

  -- Real to sfixed
  function to_sfixed (
    arg                     : REAL;     -- real
    constant left_index     : INTEGER;  -- size of integer portion
    constant right_index    : INTEGER;  -- size of fraction
    constant overflow_style : BOOLEAN := fixed_overflow_style;  -- saturate by default
    constant round_style    : BOOLEAN := fixed_round_style;  -- rounding by default
    constant guard_bits     : NATURAL := fixed_guard_bits)   -- # of guard bits
    return sfixed;

  function to_sfixed (
    arg                     : REAL;     -- real
    size_res                : sfixed;   -- for size only
    constant overflow_style : BOOLEAN := fixed_overflow_style;  -- saturate by default
    constant round_style    : BOOLEAN := fixed_round_style;  -- rounding by default
    constant guard_bits     : NATURAL := fixed_guard_bits)   -- # of guard bits
    return sfixed;

  -- signed to sfixed
  function to_sfixed (
    arg                     : SIGNED;   -- signed
    constant left_index     : INTEGER;  -- size of integer portion
    constant right_index    : INTEGER := 0;                  -- size of fraction
    constant overflow_style : BOOLEAN := fixed_overflow_style;  -- saturate by default
    constant round_style    : BOOLEAN := fixed_round_style)  -- rounding by default
    return sfixed;

  function to_sfixed (
    arg                     : SIGNED;   -- signed
    size_res                : sfixed;   -- for size only
    constant overflow_style : BOOLEAN := fixed_overflow_style;  -- saturate by default
    constant round_style    : BOOLEAN := fixed_round_style)  -- rounding by default
    return sfixed;

  -- signed to sfixed (output assumed to be size of signed input)
  function to_sfixed (
    arg : SIGNED)                       -- signed
    return sfixed;

  -- unsigned fixed point to signed fixed point (adds a "0" sign bit)
  function add_sign (
    arg : ufixed)                       -- unsigned fixed point
    return sfixed;

  -- signed fixed point to signed
  function to_signed (
    arg                     : sfixed;   -- fixed point input
    constant size           : NATURAL;  -- length of output
    constant overflow_style : BOOLEAN := fixed_overflow_style;  -- saturate by default
    constant round_style    : BOOLEAN := fixed_round_style)  -- rounding by default
    return SIGNED;

  -- signed fixed point to signed
  function to_signed (
    arg                     : sfixed;   -- fixed point input
    size_res                : SIGNED;  -- used for length of output
    constant overflow_style : BOOLEAN := fixed_overflow_style;  -- saturate by default
    constant round_style    : BOOLEAN := fixed_round_style)  -- rounding by default
    return SIGNED;

  -- signed fixed point to real
  function to_real (
    arg : sfixed)                       -- fixed point input
    return REAL;

  -- signed fixed point to integer
  function to_integer (
    arg                     : sfixed;   -- fixed point input
    constant overflow_style : BOOLEAN := fixed_overflow_style;  -- saturate by default
    constant round_style    : BOOLEAN := fixed_round_style)  -- rounding by default
    return INTEGER;
  
  -- Because of the farily complicated sizing rules in the fixed point
  -- packages these functions are provided to compute the result ranges
  -- Example:
  -- signal uf1 : ufixed (3 downto -3);
  -- signal uf2 : ufixed (4 downto -2);
  -- signal uf1multuf2 : ufixed (ufixed_high (3, -3, '*', 4, -2) downto
  --                             ufixed_low (3, -3, '*', 4, -2));
  -- uf1multuf2 <= uf1 * uf2;
  -- Valid characters: '+', '-', '*', '/', 'r' or 'R' (rem), 'm' or 'M' (mod)
  function ufixed_high (left_index, right_index   : INTEGER;
                        operation                 : CHARACTER := 'X';
                        left_index2, right_index2 : INTEGER   := 0)
    return INTEGER;
  function ufixed_low (left_index, right_index   : INTEGER;
                       operation                 : CHARACTER := 'X';
                       left_index2, right_index2 : INTEGER   := 0)
    return INTEGER;
  function sfixed_high (left_index, right_index   : INTEGER;
                        operation                 : CHARACTER := 'X';
                        left_index2, right_index2 : INTEGER   := 0)
    return INTEGER;
  function sfixed_low (left_index, right_index   : INTEGER;
                       operation                 : CHARACTER := 'X';
                       left_index2, right_index2 : INTEGER   := 0)
    return INTEGER;
  -- Same as above, but using the "size_res" input only for their ranges:
  -- signal uf1multuf2 : ufixed (ufixed_high (uf1, '*', uf2) downto
  --                             ufixed_low (uf1, '*', uf2));
  -- uf1multuf2 <= uf1 * uf2;  
  function ufixed_high (size_res  : ufixed;
                        operation : CHARACTER := 'X';
                        size_res2 : ufixed)
    return INTEGER;
  function ufixed_low (size_res  : ufixed;
                       operation : CHARACTER := 'X';
                       size_res2 : ufixed)
    return INTEGER;
  function sfixed_high (size_res  : sfixed;
                        operation : CHARACTER := 'X';
                        size_res2 : sfixed)
    return INTEGER;
  function sfixed_low (size_res  : sfixed;
                       operation : CHARACTER := 'X';
                       size_res2 : sfixed)
    return INTEGER;

  -- purpose: returns a saturated number
  function saturate (
    constant left_index  : INTEGER;
    constant right_index : INTEGER)
    return ufixed;

  -- purpose: returns a saturated number
  function saturate (
    constant left_index  : INTEGER;
    constant right_index : INTEGER)
    return sfixed;

  function saturate (
    size_res : ufixed)                  -- only the size of this is used
    return ufixed;

  function saturate (
    size_res : sfixed)                  -- only the size of this is used
    return sfixed;

  --===========================================================================
  -- Translation Functions
  --===========================================================================
  -- Maps meta-logical values
  function to_01 (
    s             : ufixed;             -- fixed point input
    constant XMAP : STD_LOGIC := '0')   -- Map x to
    return ufixed;

  -- maps meta-logical values
  function to_01 (
    s             : sfixed;             -- fixed point input
    constant XMAP : STD_LOGIC := '0')   -- Map x to
    return sfixed;

  function Is_X (arg   : ufixed) return BOOLEAN;
  function Is_X (arg   : sfixed) return BOOLEAN;
  function to_X01 (arg : ufixed) return ufixed;
  function to_X01 (arg : sfixed) return sfixed;
  function to_X01Z (arg : ufixed) return ufixed;
  function to_X01Z (arg : sfixed) return sfixed;
  function to_UX01 (arg : ufixed) return ufixed;
  function to_UX01 (arg : sfixed) return sfixed;

  -- straight vector conversion routines, needed for synthesis.
  -- These functions are here so that a std_logic_vector can be
  -- converted to and from sfixed and ufixed.  Note that you can
  -- not cast these vectors because of their negative index.
  function to_slv (
    arg : ufixed)                       -- fp vector
    return STD_LOGIC_VECTOR;
--  alias to_StdLogicVector is to_slv [ufixed return STD_LOGIC_VECTOR];
--  alias to_Std_Logic_Vector is to_slv [ufixed return STD_LOGIC_VECTOR];

  function to_slv (
    arg : sfixed)                       -- fp vector
    return STD_LOGIC_VECTOR;
--  alias to_StdLogicVector is to_slv [sfixed return STD_LOGIC_VECTOR];
--  alias to_Std_Logic_Vector is to_slv [sfixed return STD_LOGIC_VECTOR];

    function to_sulv (
    arg : ufixed)                       -- fp vector
    return STD_ULOGIC_VECTOR;
--  alias to_StdULogicVector is to_sulv [ufixed return STD_ULOGIC_VECTOR];
--  alias to_Std_ULogic_Vector is to_sulv [ufixed return STD_ULOGIC_VECTOR];

  function to_sulv (
    arg : sfixed)                       -- fp vector
    return STD_ULOGIC_VECTOR;
--  alias to_StdULogicVector is to_sulv [sfixed return STD_ULOGIC_VECTOR];
--  alias to_Std_ULogic_Vector is to_sulv [sfixed return STD_ULOGIC_VECTOR];

  function to_ufixed (
    arg                  : STD_LOGIC_VECTOR;  -- shifted vector
    constant left_index  : INTEGER;
    constant right_index : INTEGER)
    return ufixed;

  function to_ufixed (
    arg      : STD_LOGIC_VECTOR;        -- shifted vector
    size_res : ufixed)                  -- for size only
    return ufixed;

  function to_sfixed (
    arg                  : STD_LOGIC_VECTOR;  -- shifted vector
    constant left_index  : INTEGER;
    constant right_index : INTEGER)
    return sfixed;

  function to_sfixed (
    arg      : STD_LOGIC_VECTOR;        -- shifted vector
    size_res : sfixed)                  -- for size only
    return sfixed;


  -- As a concession to those who use a graphical DSP environment,
  -- these functions take parameters in those tools format and create
  -- fixed point numbers.  These functions are designed to convert from
  -- a std_logic_vector to the VHDL fixed point format using the conventions
  -- of these packages.  In a pure VHDL environment you should use the
  -- "to_ufixed" and "to_sfixed" routines.
  -- Unsigned fixed point
  function to_UFix (
    arg      : STD_LOGIC_VECTOR;
    width    : NATURAL;                 -- width of vector
    fraction : NATURAL)                 -- width of fraction
    return ufixed;
  -- signed fixed point
  function to_SFix (
    arg      : STD_LOGIC_VECTOR;
    width    : NATURAL;                 -- width of vector
    fraction : NATURAL)                 -- width of fraction
    return sfixed;
  -- finding the bounds of a number.  These functions can be used like this:
  -- signal xxx : ufixed (7 downto -3);
  -- -- Which is the same as "ufixed (UFix_high (11,3) downto UFix_low(11,3))"
  -- signal yyy : ufixed (UFix_high (11, 3, "+", 11, 3)
  --               downto UFix_low(11, 3, "+", 11, 3));
  -- Where "11" is the width of xxx (xxx'length),
  -- and 3 is the lower bound (abs (xxx'low))
  -- In a pure VHDL environment use "ufixed_high" and "ufixed_low"
  function UFix_high (width, fraction   : NATURAL;
                      operation         : CHARACTER := 'X';
                      width2, fraction2 : NATURAL   := 0)
    return INTEGER;
  function UFix_low (width, fraction   : NATURAL;
                     operation         : CHARACTER := 'X';
                     width2, fraction2 : NATURAL   := 0)
    return INTEGER;
  -- Same as above but for signed fixed point.  Note that the width
  -- of a signed fixed point number ignores the sign bit, thus
  -- width = sxxx'length-1
  function SFix_high (width, fraction   : NATURAL;
                      operation         : CHARACTER := 'X';
                      width2, fraction2 : NATURAL   := 0)
    return INTEGER;
  function SFix_low (width, fraction   : NATURAL;
                     operation         : CHARACTER := 'X';
                     width2, fraction2 : NATURAL   := 0)
    return INTEGER;
  --===========================================================================
  -- string and textio Functions
  --===========================================================================
-- rtl_synthesis off
-- synthesis translate_off
  -- purpose: writes fixed point into a line
  procedure WRITE (
    L         : inout LINE;             -- input line
    VALUE     : in    ufixed;           -- fixed point input
    JUSTIFIED : in    SIDE  := right;
    FIELD     : in    WIDTH := 0);

  -- purpose: writes fixed point into a line
  procedure WRITE (
    L         : inout LINE;             -- input line
    VALUE     : in    sfixed;           -- fixed point input
    JUSTIFIED : in    SIDE  := right;
    FIELD     : in    WIDTH := 0);

  procedure READ(L     : inout LINE;
                 VALUE : out   ufixed);

  procedure READ(L     : inout LINE;
                 VALUE : out   ufixed;
                 GOOD  : out   BOOLEAN);

  procedure READ(L     : inout LINE;
                 VALUE : out   sfixed);

  procedure READ(L     : inout LINE;
                 VALUE : out   sfixed;
                 GOOD  : out   BOOLEAN);

  alias bwrite is WRITE [LINE, ufixed, SIDE, width];
  alias bwrite is WRITE [LINE, sfixed, SIDE, width];
  alias bread is READ [LINE, ufixed];
  alias bread is READ [LINE, ufixed, BOOLEAN];
  alias bread is READ [LINE, sfixed];
  alias bread is READ [LINE, sfixed, BOOLEAN];

  -- octal read and write
  procedure OWRITE (
    L         : inout LINE;             -- input line
    VALUE     : in    ufixed;           -- fixed point input
    JUSTIFIED : in    SIDE  := right;
    FIELD     : in    WIDTH := 0);

  procedure OWRITE (
    L         : inout LINE;             -- input line
    VALUE     : in    sfixed;           -- fixed point input
    JUSTIFIED : in    SIDE  := right;
    FIELD     : in    WIDTH := 0);

  procedure OREAD(L     : inout LINE;
                  VALUE : out   ufixed);

  procedure OREAD(L     : inout LINE;
                  VALUE : out   ufixed;
                  GOOD  : out   BOOLEAN);

  procedure OREAD(L     : inout LINE;
                  VALUE : out   sfixed);

  procedure OREAD(L     : inout LINE;
                  VALUE : out   sfixed;
                  GOOD  : out   BOOLEAN);

  -- hex read and write
  procedure HWRITE (
    L         : inout LINE;             -- input line
    VALUE     : in    ufixed;           -- fixed point input
    JUSTIFIED : in    SIDE  := right;
    FIELD     : in    WIDTH := 0);

  -- purpose: writes fixed point into a line
  procedure HWRITE (
    L         : inout LINE;             -- input line
    VALUE     : in    sfixed;           -- fixed point input
    JUSTIFIED : in    SIDE  := right;
    FIELD     : in    WIDTH := 0);

  procedure HREAD(L     : inout LINE;
                  VALUE : out   ufixed);

  procedure HREAD(L     : inout LINE;
                  VALUE : out   ufixed;
                  GOOD  : out   BOOLEAN);

  procedure HREAD(L     : inout LINE;
                  VALUE : out   sfixed);

  procedure HREAD(L     : inout LINE;
                  VALUE : out   sfixed;
                  GOOD  : out   BOOLEAN);

  -- returns a string, useful for:
  -- assert (x = y) report "error found " & to_string(x) severity error;
  function to_string (
    value     : ufixed;
    justified : SIDE  := right;
    field     : WIDTH := 0
    ) return STRING;

  alias to_bstring is to_string [ufixed, SIDE, width return STRING];

  function to_ostring (
    value     : ufixed;
    justified : SIDE  := right;
    field     : WIDTH := 0
    ) return STRING;

  function to_hstring (
    value     : ufixed;
    justified : SIDE  := right;
    field     : WIDTH := 0
    ) return STRING;

  function to_string (
    value     : sfixed;
    justified : SIDE  := right;
    field     : WIDTH := 0
    ) return STRING;

  alias to_bstring is to_string [sfixed, SIDE, width return STRING];

  function to_ostring (
    value     : sfixed;
    justified : SIDE  := right;
    field     : WIDTH := 0
    ) return STRING;

  function to_hstring (
    value     : sfixed;
    justified : SIDE  := right;
    field     : WIDTH := 0
    ) return STRING;

  -- From string functions allow you to convert a string into a fixed
  -- point number.  Example:
  --  signal uf1 : ufixed (3 downto -3);
  --  uf1 <= from_string ("0110.100", uf1'high, uf1'low); -- 6.5
  -- The "." is optional in this syntax, however it exist and is
  -- in the wrong location an error is produced.  Overflow will
  -- result in saturation.
  function from_string (
    bstring              : STRING;      -- binary string
    constant left_index  : INTEGER;
    constant right_index : INTEGER)
    return ufixed;
  alias from_bstring is from_string [STRING, INTEGER, INTEGER return ufixed];

  -- Octal and hex conversions work as follows:
  -- uf1 <= from_hstring ("6.8", 3, -3); -- 6.5 (bottom zeros dropped)
  -- uf1 <= from_ostring ("06.4", 3, -3); -- 6.5 (top zeros dropped)
  function from_ostring (
    ostring              : STRING;      -- Octal string
    constant left_index  : INTEGER;
    constant right_index : INTEGER)
    return ufixed;

  function from_hstring (
    hstring              : STRING;      -- hex string
    constant left_index  : INTEGER;
    constant right_index : INTEGER)
    return ufixed;

  function from_string (
    bstring              : STRING;      -- binary string
    constant left_index  : INTEGER;
    constant right_index : INTEGER)
    return sfixed;
  alias from_bstring is from_string [STRING, INTEGER, INTEGER return sfixed];

  function from_ostring (
    ostring              : STRING;      -- Octal string
    constant left_index  : INTEGER;
    constant right_index : INTEGER)
    return sfixed;

  function from_hstring (
    hstring              : STRING;      -- hex string
    constant left_index  : INTEGER;
    constant right_index : INTEGER)
    return sfixed;

  -- Same as above, "size_res" is used for it's range only.
  function from_string (
    bstring  : STRING;                  -- binary string
    size_res : ufixed)
    return ufixed;
  alias from_bstring is from_string [STRING, ufixed return ufixed];

  function from_ostring (
    ostring  : STRING;                  -- Octal string
    size_res : ufixed)
    return ufixed;

  function from_hstring (
    hstring  : STRING;                  -- hex string
    size_res : ufixed)
    return ufixed;

  function from_string (
    bstring  : STRING;                  -- binary string
    size_res : sfixed)
    return sfixed;
  alias from_bstring is from_string [STRING, sfixed return sfixed];

  function from_ostring (
    ostring  : STRING;                  -- Octal string
    size_res : sfixed)
    return sfixed;

  function from_hstring (
    hstring  : STRING;                  -- hex string
    size_res : sfixed)
    return sfixed;

  -- Direct converstion functions.  Example:
  --  signal uf1 : ufixed (3 downto -3);
  --  uf1 <= from_string ("0110.100"); -- 6.5
  -- In this case the "." is not optional, and the size of
  -- the output must match exactly.
  function from_string (
    bstring : STRING)                   -- binary string
    return ufixed;
  alias from_bstring is from_string [STRING return ufixed];

  -- Direct octal and hex converstion functions.  In this case
  -- the string lengths must match.  Example:
  -- signal sf1 := sfixed (5 downto -3);
  -- sf1 <= from_ostring ("71.4") -- -6.5
  function from_ostring (
    ostring : STRING)                   -- Octal string
    return ufixed;

  function from_hstring (
    hstring : STRING)                   -- hex string
    return ufixed;

  function from_string (
    bstring : STRING)                   -- binary string
    return sfixed;
  alias from_bstring is from_string [STRING return sfixed];

  function from_ostring (
    ostring : STRING)                   -- Octal string
    return sfixed;

  function from_hstring (
    hstring : STRING)                   -- hex string
    return sfixed;

-- synthesis translate_on
-- rtl_synthesis on
  -- This type is here for the floating point package.
  type round_type is (round_nearest,    -- Default, nearest LSB '0'
                      round_inf,        -- Round to positive
                      round_neginf,     -- Round to negate
                      round_zero);      -- Round towards zero
  -- These are the same as the C FE_TONEAREST, FE_UPWARD, FE_DOWNWARD,
  -- and FE_TOWARDZERO floating point rounding macros.
  function to_StdLogicVector (
    arg : ufixed)                       -- fp vector
    return STD_LOGIC_VECTOR;
  function to_Std_Logic_Vector (
    arg : ufixed)                       -- fp vector
    return STD_LOGIC_VECTOR;
  function to_StdLogicVector (
    arg : sfixed)                       -- fp vector
    return STD_LOGIC_VECTOR;
  function to_Std_Logic_Vector (
    arg : sfixed)                       -- fp vector
    return STD_LOGIC_VECTOR;
end package fixed_pkg;
library ieee;
use ieee.std_logic_1164.all;
use ieee.numeric_std.all;
use ieee.math_real.all;
use std.textio.all;
use ieee.std_logic_textio.all;          -- %%% for testing only
package body fixed_pkg is
  -- Author David Bishop (dbishop@vhdl.org)
  -- Other contributers: Jim Lewis, Yannick Grugni, Ryan W. Hilton
  -- null array constants
  constant NAUF : ufixed (0 downto 1)           := (others => '0');
  constant NASF : sfixed (0 downto 1)           := (others => '0');
  constant NSLV : STD_LOGIC_VECTOR (0 downto 1) := (others => '0');

  -- This differed constant will tell you if the package body is synthesizable
  -- or implemented as real numbers, set to "true" if synthesizable.
  constant fixedsynth_or_real : BOOLEAN := true;

  --%%% Can be removed in vhdl-200x, will be implicit.
  -- purpose: To find the largest of 2 numbers
  function maximum (l, r : INTEGER)
    return INTEGER is
  begin  -- function maximum
    if L > R then return L;
    else return R;
    end if;
  end function maximum;

  function minimum (l, r : INTEGER)
    return INTEGER is
  begin  -- function minimum
    if L > R then return R;
    else return L;
    end if;
  end function minimum;

  -- %%% Remove the following function (duplicates of new numeric_std)
  function "sra" (arg : SIGNED; count : INTEGER)
    return SIGNED is
  begin
    if (COUNT >= 0) then
      return SHIFT_RIGHT(arg, count);
    else
      return SHIFT_LEFT(arg, -count);
    end if;
  end function "sra";

  -- %%% Replace or_reducex with "or", and_reducex with "and", and
  -- %%% xor_reducex with "xor", then remove the following 3 functions
  -- purpose: OR all of the bits in a vector together
  -- This is a copy of the proposed "or_reduce" from 1076.3
  function or_reducex (arg : STD_LOGIC_VECTOR)
    return STD_LOGIC is
    variable Upper, Lower : STD_LOGIC;
    variable Half         : INTEGER;
    variable BUS_int      : STD_LOGIC_VECTOR (arg'length - 1 downto 0);
    variable Result       : STD_LOGIC;
  begin
    if (arg'length < 1) then            -- In the case of a NULL range
      Result := '0';
    else
      BUS_int := to_ux01 (arg);
      if (BUS_int'length = 1) then
        Result := BUS_int (BUS_int'left);
      elsif (BUS_int'length = 2) then
        Result := BUS_int (BUS_int'right) or BUS_int (BUS_int'left);
      else
        Half   := (BUS_int'length + 1) / 2 + BUS_int'right;
        Upper  := or_reducex (BUS_int (BUS_int'left downto Half));
        Lower  := or_reducex (BUS_int (Half - 1 downto BUS_int'right));
        Result := Upper or Lower;
      end if;
    end if;
    return Result;
  end function or_reducex;

  -- purpose: AND all of the bits in a vector together
  -- This is a copy of the proposed "and_reduce" from 1076.3
  function and_reducex (arg : STD_LOGIC_VECTOR)
    return STD_LOGIC is
    variable Upper, Lower : STD_LOGIC;
    variable Half         : INTEGER;
    variable BUS_int      : STD_LOGIC_VECTOR (arg'length - 1 downto 0);
    variable Result       : STD_LOGIC;
  begin
    if (arg'length < 1) then            -- In the case of a NULL range
      Result := '1';
    else
      BUS_int := to_ux01 (arg);
      if (BUS_int'length = 1) then
        Result := BUS_int (BUS_int'left);
      elsif (BUS_int'length = 2) then
        Result := BUS_int (BUS_int'right) and BUS_int (BUS_int'left);
      else
        Half   := (BUS_int'length + 1) / 2 + BUS_int'right;
        Upper  := and_reducex (BUS_int (BUS_int'left downto Half));
        Lower  := and_reducex (BUS_int (Half - 1 downto BUS_int'right));
        Result := Upper and Lower;
      end if;
    end if;
    return Result;
  end function and_reducex;

  function xor_reducex (arg : STD_LOGIC_VECTOR) return STD_ULOGIC is
    variable Upper, Lower : STD_ULOGIC;
    variable Half         : INTEGER;
    variable BUS_int      : STD_LOGIC_VECTOR (arg'length - 1 downto 0);
    variable Result       : STD_ULOGIC := '0';  -- In the case of a NULL range
  begin
    if (arg'length >= 1) then
      BUS_int := to_ux01 (arg);
      if (BUS_int'length = 1) then
        Result := BUS_int (BUS_int'left);
      elsif (BUS_int'length = 2) then
        Result := BUS_int(BUS_int'right) xor BUS_int(BUS_int'left);
      else
        Half   := (BUS_int'length + 1) / 2 + BUS_int'right;
        Upper  := xor_reducex (BUS_int (BUS_int'left downto Half));
        Lower  := xor_reducex (BUS_int (Half - 1 downto BUS_int'right));
        Result := Upper xor Lower;
      end if;
    end if;
    return Result;
  end function xor_reducex;

  --%%% remove the following function and table
  -- Match table, copied form new std_logic_1164
  type stdlogic_table is array(STD_ULOGIC, STD_ULOGIC) of STD_ULOGIC;
  constant match_logic_table : stdlogic_table := (
    -----------------------------------------------------
    -- U    X    0    1    Z    W    L    H    -         |   |  
    -----------------------------------------------------
    ('U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', '1'),  -- | U |
    ('U', 'X', 'X', 'X', 'X', 'X', 'X', 'X', '1'),  -- | X |
    ('U', 'X', '1', '0', 'X', 'X', '1', '0', '1'),  -- | 0 |
    ('U', 'X', '0', '1', 'X', 'X', '0', '1', '1'),  -- | 1 |
    ('U', 'X', 'X', 'X', 'X', 'X', 'X', 'X', '1'),  -- | Z |
    ('U', 'X', 'X', 'X', 'X', 'X', 'X', 'X', '1'),  -- | W |
    ('U', 'X', '1', '0', 'X', 'X', '1', '0', '1'),  -- | L |
    ('U', 'X', '0', '1', 'X', 'X', '0', '1', '1'),  -- | H |
    ('1', '1', '1', '1', '1', '1', '1', '1', '1')   -- | - |
    );
  
    constant no_match_logic_table : stdlogic_table := (
    -----------------------------------------------------
    -- U    X    0    1    Z    W    L    H    -         |   |  
    -----------------------------------------------------
    ('U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', '0'),  -- | U |
    ('U', 'X', 'X', 'X', 'X', 'X', 'X', 'X', '0'),  -- | X |
    ('U', 'X', '0', '1', 'X', 'X', '0', '1', '0'),  -- | 0 |
    ('U', 'X', '1', '0', 'X', 'X', '1', '0', '0'),  -- | 1 |
    ('U', 'X', 'X', 'X', 'X', 'X', 'X', 'X', '0'),  -- | Z |
    ('U', 'X', 'X', 'X', 'X', 'X', 'X', 'X', '0'),  -- | W |
    ('U', 'X', '0', '1', 'X', 'X', '0', '1', '0'),  -- | L |
    ('U', 'X', '1', '0', 'X', 'X', '1', '0', '0'),  -- | H |
    ('0', '0', '0', '0', '0', '0', '0', '0', '0')   -- | - |
    );

  -------------------------------------------------------------------
  -- ?= functions, Similar to "std_match", but returns "std_ulogic".
  -------------------------------------------------------------------
  -- %%% FUNCTION "?=" ( l, r : std_ulogic ) RETURN std_ulogic IS
  function \?=\ (l, r : STD_ULOGIC) return STD_ULOGIC is
  begin
    return match_logic_table (l, r);
  end function \?=\;
  -- %%% END FUNCTION "?=";
  -- %%% FUNCTION "?/=" ( l, r : std_ulogic ) RETURN std_ulogic is
  function \?/=\ (l, r : STD_ULOGIC) return STD_ULOGIC is
  begin
    return no_match_logic_table (l, r);
  end function \?/=\;
  -- %%% END FUNCTION "?/=";
  -- %%% end remove

  -- Special version of "minimum" to do some boundary checking without errors
  function mins (l, r : INTEGER)
    return INTEGER is
  begin  -- function mins
    if (L = INTEGER'low or R = INTEGER'low) then
      return 0;                         -- error condition
    end if;
    return minimum (L, R);
  end function mins;

  -- Special version of "minimum" to do some boundary checking with errors
  function mine (l, r : INTEGER)
    return INTEGER is
  begin  -- function mine
    if (L = INTEGER'low or R = INTEGER'low) then
      report "FIXED_GENERIC_PKG: Unbounded number passed, was a literal used?"
        severity error;
      return 0;
    end if;
    return minimum (L, R);
  end function mine;

  -- The following functions are used only internally.  Every function
  -- calls "cleanvec" either directly or indirectly.
  -- purpose: Fixes "downto" problem and resolves meta states
  function cleanvec (
    arg : sfixed)                       -- input
    return sfixed is
    constant left_index  : INTEGER := maximum(arg'left, arg'right);
    constant right_index : INTEGER := mins(arg'left, arg'right);
    variable result      : sfixed (arg'range);
  begin  -- function cleanvec
    assert not ((arg'left < arg'right) and (arg'low /= INTEGER'low))
      report "FIXED_GENERIC_PKG: Vector passed using a ""to"" range, expected is ""downto"""
      severity error;
    return arg;
  end function cleanvec;

  -- purpose: Fixes "downto" problem and resolves meta states
  function cleanvec (
    arg : ufixed)                       -- input
    return ufixed is
    constant left_index  : INTEGER := maximum(arg'left, arg'right);
    constant right_index : INTEGER := mins(arg'left, arg'right);
    variable result      : ufixed (arg'range);
  begin  -- function cleanvec
    assert not ((arg'left < arg'right) and (arg'low /= INTEGER'low))
      report "FIXED_GENERIC_PKG: Vector passed using a ""to"" range, expected is ""downto"""
      severity error;
    return arg;
  end function cleanvec;

  -- Type cast a "unsigned" into a "ufixed", used internally
  function to_fixed (
    arg                  : UNSIGNED;    -- shifted vector
    constant left_index  : INTEGER;
    constant right_index : INTEGER)
    return ufixed is
    variable result : ufixed (left_index downto right_index);
--    variable j      : INTEGER := arg'high;  -- index for arg
  begin  -- function to_fixed
    result := ufixed(arg);
--    floop : for i in result'range loop
--      result(i) := arg(j);                  -- res(4) := arg (4 + 3)
--      j         := j - 1;
--    end loop floop;
    return result;
  end function to_fixed;

  -- Type cast a "signed" into an "sfixed", used internally
  function to_fixed (
    arg                  : SIGNED;      -- shifted vector
    constant left_index  : INTEGER;
    constant right_index : INTEGER)
    return sfixed is
    variable result : sfixed (left_index downto right_index);
--    variable j      : INTEGER := arg'high;  -- index for arg
  begin  -- function to_fixed
    result := sfixed(arg);
--    floop : for i in result'range loop
--      result(i) := arg(j);                  -- res(4) := arg (4 + 3)
--      j         := j - 1;
--    end loop floop;
    return result;
  end function to_fixed;

  -- Type cast a "ufixed" into an "unsigned", used internally
  function to_uns (
    arg : ufixed)                       -- fp vector
    return UNSIGNED is
    subtype  t is UNSIGNED(arg'high - arg'low downto 0);
    variable slv : t;
  begin  -- function to_uns
    slv := t(arg);
--    floop : for i in slv'range loop
--      slv(i) := arg(i + arg'low);       -- slv(7) := arg (7 - 3)
--    end loop floop;
    return UNSIGNED(to_X01(std_logic_vector(slv)));
  end function to_uns;

  -- Type cast an "sfixed" into a "signed", used internally
  function to_s (
    arg : sfixed)                       -- fp vector
    return SIGNED is
    subtype  t is SIGNED(arg'high - arg'low downto 0);
    variable slv : t;
  begin  -- function to_s
    slv := t(arg);
--    floop : for i in slv'range loop
--      slv(i) := arg(i + arg'low);       -- slv(7) := arg (7 - 3)
--    end loop floop;
    return SIGNED(to_X01(std_logic_vector(slv)));
  end function to_s;

  -- adds 1 to the LSB of the number
  procedure round_up (arg       : in  ufixed;
                      result    : out ufixed;
                      overflowx : out BOOLEAN) is
    variable arguns, resuns : UNSIGNED (arg'high-arg'low+1 downto 0) :=
      (others => '0');
  begin  -- round_up
    arguns (arguns'high-1 downto 0) := to_uns (arg);
    resuns                          := arguns + 1;
    result := to_fixed(resuns(arg'high-arg'low
                              downto 0), arg'high, arg'low);
    overflowx := (resuns(resuns'high) = '1');
  end procedure round_up;

  -- adds 1 to the LSB of the number
  procedure round_up (arg       : in  sfixed;
                      result    : out sfixed;
                      overflowx : out BOOLEAN) is
    variable args, ress : SIGNED (arg'high-arg'low+1 downto 0);
  begin  -- round_up
    args (args'high-1 downto 0) := to_s (arg);
    args(args'high)             := arg(arg'high);  -- sign extend
    ress                        := args + 1;
    result := to_fixed(ress (ress'high-1
                             downto 0), arg'high, arg'low);
    overflowx := ((arg(arg'high) /= ress(ress'high-1))
                  and (or_reducex (STD_LOGIC_VECTOR(ress)) /= '0'));
  end procedure round_up;

  -- Rounding - Performs a "round_nearest" (IEEE 754) which rounds up
  -- when the remainder is > 0.5.  If the remainder IS 0.5 then if the
  -- bottom bit is a "1" it is rounded, otherwise it remains the same.
  function round_fixed (arg            : ufixed;
                        remainder      : ufixed;
                        overflow_style : BOOLEAN := fixed_overflow_style)
    return ufixed is
    variable rounds         : BOOLEAN;
    variable round_overflow : BOOLEAN;
    variable result         : ufixed (arg'range);
  begin
    rounds := false;
    if (remainder'length > 1) then
      if (remainder (remainder'high) = '1') then
        rounds := (arg(arg'low) = '1')
                  or (or_reducex (to_slv(remainder(remainder'high-1 downto
                                                   remainder'low))) = '1');
      end if;
    else
      rounds := (arg(arg'low) = '1') and (remainder (remainder'high) = '1');
    end if;
    if rounds then
      round_up(arg       => arg,
               result    => result,
               overflowx => round_overflow);
    else
      result := arg;
    end if;
    if (overflow_style = fixed_saturate) and round_overflow then
      result := saturate (result'high, result'low);
    end if;
    return result;
  end function round_fixed;

  -- Rounding case statement
  function round_fixed (arg            : sfixed;
                        remainder      : sfixed;
                        overflow_style : BOOLEAN := fixed_overflow_style)
    return sfixed is
    variable rounds         : BOOLEAN;
    variable round_overflow : BOOLEAN;
    variable result         : sfixed (arg'range);
  begin
    rounds := false;
    if (remainder'length > 1) then
      if (remainder (remainder'high) = '1') then
        rounds := (arg(arg'low) = '1')
                  or (or_reducex (to_slv(remainder(remainder'high-1 downto
                                                   remainder'low))) = '1');
      end if;
    else
      rounds := (arg(arg'low) = '1') and (remainder (remainder'high) = '1');
    end if;
    if rounds then
      round_up(arg       => arg,
               result    => result,
               overflowx => round_overflow);
    else
      result := arg;
    end if;
    if round_overflow then
      if (overflow_style = fixed_saturate) then
        if arg(arg'high) = '0' then
          result := saturate (result'high, result'low);
        else
          result := not saturate (result'high, result'low);
        end if;
--      else
--        result(result'high) := arg(arg'high);  -- fix sign bit in wrap
      end if;
    end if;
    return result;
  end function round_fixed;

-----------------------------------------------------------------------------
-- Visible functions
-----------------------------------------------------------------------------

  -- casting functions.  These are needed for synthesis where typically
  -- the only input and output type is a std_logic_vector.
  function to_slv (
    arg : ufixed)                       -- fixed point vector
    return STD_LOGIC_VECTOR is
    subtype t is STD_LOGIC_VECTOR (arg'high - arg'low downto 0);
    variable slv : t;
  begin
    if arg'length < 1 then
      return NSLV;
    end if;
    slv := t (arg);
    return slv;
  end function to_slv;

  function to_slv (
    arg : sfixed)                       -- fixed point vector
    return STD_LOGIC_VECTOR is
    subtype t is STD_LOGIC_VECTOR (arg'high - arg'low downto 0);
    variable slv : t;
  begin
    if arg'length < 1 then
      return NSLV;
    end if;
    slv := t (arg);
    return slv;
  end function to_slv;

  function to_sulv (
    arg : ufixed)                       -- fixed point vector
    return STD_ULOGIC_VECTOR is
  begin
    return to_stdulogicvector (to_slv(arg));
  end function to_sulv;

  function to_sulv (
    arg : sfixed)                       -- fixed point vector
    return STD_ULOGIC_VECTOR is
  begin
    return to_stdulogicvector (to_slv(arg));
  end function to_sulv;

  function to_ufixed (
    arg                  : STD_LOGIC_VECTOR;  -- shifted vector
    constant left_index  : INTEGER;
    constant right_index : INTEGER)
    return ufixed is
    variable result : ufixed (left_index downto right_index);
  begin
    if (arg'length < 1 or right_index > left_index) then
      return NAUF;
    end if;
    if (arg'length /= result'length) then
      report "FIXED_GENERIC_PKG.TO_UFIXED (STD_LOGIC_VECTOR) "
        & "Vector lengths do not match.  Input length is "
        & INTEGER'image(arg'length) & " and output will be "
        & INTEGER'image(result'length) & " wide."
        severity error;
      return NAUF;
    else
      result := to_fixed (arg         => UNSIGNED(arg),
                          left_index  => left_index,
                          right_index => right_index);
      return result;
    end if;
  end function to_ufixed;

  function to_sfixed (
    arg                  : STD_LOGIC_VECTOR;  -- shifted vector
    constant left_index  : INTEGER;
    constant right_index : INTEGER)
    return sfixed is
    variable result : sfixed (left_index downto right_index);
  begin
    if (arg'length < 1 or right_index > left_index) then
      return NASF;
    end if;
    if (arg'length /= result'length) then
      report "FIXED_GENERIC_PKG.TO_SFIXED (STD_LOGIC_VECTOR) "
        & "Vector lengths do not match.  Input length is "
        & INTEGER'image(arg'length) & " and output will be "
        & INTEGER'image(result'length) & " wide."
        severity error;
      return NASF;
    else
      result := to_fixed (arg         => SIGNED(arg),
                          left_index  => left_index,
                          right_index => right_index);
      return result;
    end if;
  end function to_sfixed;

 -- Two's complement number, Grows the vector by 1 bit.
  -- because "abs (1000.000) = 01000.000" or abs(-16) = 16.
  function "abs" (
    arg : sfixed)                       -- fixed point input
    return sfixed is
    constant left_index  : INTEGER := arg'high;
    constant right_index : INTEGER := mine(arg'low, arg'low);
    variable ressns      : SIGNED (arg'length downto 0);
    variable result      : sfixed (left_index+1 downto right_index);
  begin
    if (arg'length < 1 or result'length < 1) then
      return NASF;
    end if;
    ressns (arg'length-1 downto 0) := to_s (cleanvec (arg));
    ressns (arg'length)            := ressns (arg'length-1);  -- expand sign bit
    result                         := to_fixed (abs(ressns), left_index+1, right_index);
    return result;
  end function "abs";

  -- also grows the vector by 1 bit.
  function "-" (
    arg : sfixed)                       -- fixed point input
    return sfixed is
    constant left_index  : INTEGER := arg'high+1;
    constant right_index : INTEGER := mine(arg'low, arg'low);
    variable ressns      : SIGNED (arg'length downto 0);
    variable result      : sfixed (left_index downto right_index);
  begin
    if (arg'length < 1 or result'length < 1) then
      return NASF;
    end if;
    ressns (arg'length-1 downto 0) := to_s (cleanvec(arg));
    ressns (arg'length)            := ressns (arg'length-1);  -- expand sign bit
    result                         := to_fixed (-ressns, left_index, right_index);
    return result;
  end function "-";

  function "abs" (arg : sfixed) return ufixed is
    constant left_index  : INTEGER := arg'high;
    constant right_index : INTEGER := mine(arg'low, arg'low);
    variable xarg        : sfixed(left_index+1 downto right_index);
    variable result      : ufixed(left_index downto right_index);
  begin
    if arg'length < 1 then
      return NAUF;
    end if;
    xarg   := abs(arg);
    result := ufixed (xarg (left_index downto right_index));
    return result;
  end function "abs";

  -- Addition
  function "+" (
    l, r : ufixed)    -- ufixed(a downto b) + ufixed(c downto d) =
    return ufixed is                    -- ufixed(max(a,c)+1 downto min(b,d))
    constant left_index       : INTEGER := maximum(l'high, r'high)+1;
    constant right_index      : INTEGER := mins(l'low, r'low);
    variable lresize, rresize : ufixed (left_index downto right_index);
    variable result           : ufixed (left_index downto right_index);
    variable lslv, rslv : UNSIGNED (left_index-right_index
                                    downto 0);
    variable result_slv : UNSIGNED (left_index-right_index
                                    downto 0);
  begin
    if (l'length < 1 or r'length < 1) then
      return NAUF;
    end if;
    lresize    := resize (l, left_index, right_index);
    rresize    := resize (r, left_index, right_index);
    lslv       := to_uns (lresize);
    rslv       := to_uns (rresize);
    result_slv := lslv + rslv;
    result     := to_fixed(result_slv, left_index, right_index);
    return result;
  end function "+";

  function "+" (
    l, r : sfixed)    -- sfixed(a downto b) + sfixed(c downto d) = 
    return sfixed is                    -- sfixed(max(a,c)+1 downto min(b,d))
    constant left_index       : INTEGER := maximum(l'high, r'high)+1;
    constant right_index      : INTEGER := mins(l'low, r'low);
    variable lresize, rresize : sfixed (left_index downto right_index);
    variable result           : sfixed (left_index downto right_index);
    variable lslv, rslv       : SIGNED (left_index-right_index downto 0);
    variable result_slv       : SIGNED (left_index-right_index downto 0);
  begin
    if (l'length < 1 or r'length < 1) then
      return NASF;
    end if;
    lresize    := resize (l, left_index, right_index);
    rresize    := resize (r, left_index, right_index);
    lslv       := to_s (lresize);
    rslv       := to_s (rresize);
    result_slv := lslv + rslv;
    result     := to_fixed(result_slv, left_index, right_index);
    return result;
  end function "+";

  -- Subtraction
  function "-" (
    l, r : ufixed)    -- ufixed(a downto b) - ufixed(c downto d) =
    return ufixed is                    -- ufixed(max(a,c)+1 downto min(b,d))
    constant left_index       : INTEGER := maximum(l'high, r'high)+1;
    constant right_index      : INTEGER := mins(l'low, r'low);
    variable lresize, rresize : ufixed (left_index downto right_index);
    variable result           : ufixed (left_index downto right_index);
    variable lslv, rslv : UNSIGNED (left_index-right_index
                                    downto 0);
    variable result_slv : UNSIGNED (left_index-right_index
                                    downto 0);
  begin
    if (l'length < 1 or r'length < 1) then
      return NAUF;
    end if;
    lresize    := resize (l, left_index, right_index);
    rresize    := resize (r, left_index, right_index);
    lslv       := to_uns (lresize);
    rslv       := to_uns (rresize);
    result_slv := lslv - rslv;
    result     := to_fixed(result_slv, left_index, right_index);
    return result;
  end function "-";

  function "-" (
    l, r : sfixed)    -- sfixed(a downto b) - sfixed(c downto d) = 
    return sfixed is                    -- sfixed(max(a,c)+1 downto min(b,d))
    constant left_index       : INTEGER := maximum(l'high, r'high)+1;
    constant right_index      : INTEGER := mins(l'low, r'low);
    variable lresize, rresize : sfixed (left_index downto right_index);
    variable result           : sfixed (left_index downto right_index);
    variable lslv, rslv       : SIGNED (left_index-right_index downto 0);
    variable result_slv       : SIGNED (left_index-right_index downto 0);
  begin
    if (l'length < 1 or r'length < 1) then
      return NASF;
    end if;
    lresize    := resize (l, left_index, right_index);
    rresize    := resize (r, left_index, right_index);
    lslv       := to_s (lresize);
    rslv       := to_s (rresize);
    result_slv := lslv - rslv;
    result     := to_fixed(result_slv, left_index, right_index);
    return result;
  end function "-";

  function "*" (
    l, r : ufixed)    -- ufixed(a downto b) * ufixed(c downto d) =
    return ufixed is                    -- ufixed(a+c+1 downto b+d)
    variable lslv       : UNSIGNED (l'length-1 downto 0);
    variable rslv       : UNSIGNED (r'length-1 downto 0);
    variable result_slv : UNSIGNED (r'length+l'length-1 downto 0);
    variable result : ufixed (l'high + r'high+1 downto
                                  mine(l'low, l'low) + mine(r'low, r'low));
  begin
    if (l'length < 1 or r'length < 1 or
        result'length /= result_slv'length) then
      return NAUF;
    end if;
    lslv       := to_uns (cleanvec(l));
    rslv       := to_uns (cleanvec(r));
    result_slv := lslv * rslv;
    result     := to_fixed (result_slv, result'high, result'low);
    return result;
  end function "*";

  function "*" (
    l, r : sfixed)    -- sfixed(a downto b) * sfixed(c downto d) = 
    return sfixed is                    --  sfixed(a+c+1 downto b+d)
    variable lslv       : SIGNED (l'length-1 downto 0);
    variable rslv       : SIGNED (r'length-1 downto 0);
    variable result_slv : SIGNED (r'length+l'length-1 downto 0);
    variable result : sfixed (l'high + r'high+1 downto
                                  mine(l'low, l'low) + mine(r'low, r'low));
  begin
    if (l'length < 1 or r'length < 1 or
        result'length /= result_slv'length) then
      return NASF;
    end if;
    lslv       := to_s (cleanvec(l));
    rslv       := to_s (cleanvec(r));
    result_slv := lslv * rslv;
    result     := to_fixed (result_slv, result'high, result'low);
    return result;
  end function "*";

  function "/" (
    l, r : ufixed)    -- ufixed(a downto b) / ufixed(c downto d) = 
    return ufixed is                    --  ufixed(a-d downto b-c-1)
  begin
    return divide (l, r);
  end function "/";

  function "/" (
    l, r : sfixed)    -- sfixed(a downto b) / sfixed(c downto d) = 
    return sfixed is                    -- sfixed(a-d+1 downto b-c)
  begin
    return divide (l, r);
  end function "/";

  -- This version of divide gives the user more control
  -- ufixed(a downto b) / ufixed(c downto d) = ufixed(a-d downto b-c-1)
  function divide (
    l, r                 : ufixed;
    constant round_style : BOOLEAN := fixed_round_style;
    constant guard_bits  : NATURAL := fixed_guard_bits)
    return ufixed is
    variable result : ufixed (l'high - mine(r'low, r'low)
                                  downto mine (l'low, l'low) - r'high -1);
    variable dresult    : ufixed (result'high downto result'low -guard_bits);
    variable lresize    : ufixed (l'high downto l'high - dresult'length+1);
    variable lslv       : UNSIGNED (lresize'length-1 downto 0);
    variable rslv       : UNSIGNED (r'length-1 downto 0);
    variable result_slv : UNSIGNED (lresize'length-1 downto 0);
  begin
    if (l'length < 1 or r'length < 1 or
        mins(r'low, r'low) /= r'low or mins(l'low, l'low) /= l'low) then
      return NAUF;
    end if;
    lresize := resize (l, lresize'high, lresize'low);
    lslv    := to_uns (cleanvec (lresize));
    rslv    := to_uns (cleanvec (r));
    if (rslv = 0) then
      report "FIXED_GENERIC_PKG.DIVIDE uFixed point Division by zero" severity error;
      result := saturate (result'high, result'low);          -- saturate
    else
      result_slv := lslv / rslv;
      dresult    := to_fixed (result_slv, dresult'high, dresult'low);
      result := resize (arg                 => dresult,
                             left_index     => result'high,
                             right_index    => result'low,
                             round_style    => round_style,
                             overflow_style => fixed_wrap);  -- overflow impossible
    end if;
    return result;
  end function divide;

  -- sfixed(a downto b) / sfixed(c downto d) = sfixed(a-d+1 downto b-c)
  function divide (
    l, r                 : sfixed;
    constant round_style : BOOLEAN := fixed_round_style;
    constant guard_bits  : NATURAL := fixed_guard_bits)
    return sfixed is
    variable result : sfixed (l'high - mine(r'low, r'low)+1
                                  downto mine (l'low, l'low) - r'high);
    variable dresult    : sfixed (result'high downto result'low-guard_bits);
    variable lresize    : sfixed (l'high+1 downto l'high+1 -dresult'length+1);
    variable lslv       : SIGNED (lresize'length-1 downto 0);
    variable rslv       : SIGNED (r'length-1 downto 0);
    variable result_slv : SIGNED (lresize'length-1 downto 0);
  begin
    if (l'length < 1 or r'length < 1 or
        mins(r'low, r'low) /= r'low or mins(l'low, l'low) /= l'low) then
      return NASF;
    end if;
    lresize := resize (l, lresize'high, lresize'low);
    lslv    := to_s (cleanvec (lresize));
    rslv    := to_s (cleanvec (r));
    if (rslv = 0) then
      report "FIXED_GENERIC_PKG.DIVIDE uFixed point Division by zero" severity error;
      result := saturate (result'high, result'low);
    else
      result_slv := lslv / rslv;
      dresult    := to_fixed (result_slv, dresult'high, dresult'low);
      result := resize (arg                 => dresult,
                             left_index     => result'high,
                             right_index    => result'low,
                             round_style    => round_style,
                             overflow_style => fixed_wrap);  -- overflow impossible
    end if;
    return result;
  end function divide;

  -- 1 / ufixed(a downto b) = ufixed(-b downto -a-1)
  function reciprocal (
    arg                  : ufixed;      -- fixed point input
    constant round_style : BOOLEAN := fixed_round_style;
    constant guard_bits  : NATURAL := fixed_guard_bits)
    return ufixed is
    constant one : ufixed (0 downto 0) := "1";
  begin
    return divide(l           => one,
                  r           => arg,
                  round_style => round_style,
                  guard_bits  => guard_bits);
  end function reciprocal;

  -- 1 / sfixed(a downto b) = sfixed(-b+1 downto -a)
  function reciprocal (
    arg                  : sfixed;                         -- fixed point input
    constant round_style : BOOLEAN := fixed_round_style;
    constant guard_bits  : NATURAL := fixed_guard_bits)
    return sfixed is
    constant one     : sfixed (1 downto 0) := "01";        -- extra bit.
    variable resultx : sfixed (-mine(arg'low, arg'low)+2 downto -arg'high);
  begin
    if (arg'length < 1 or resultx'length < 1) then
      return NASF;
    else
      resultx := divide(l           => one,
                        r           => arg,
                        round_style => round_style,
                        guard_bits  => guard_bits);
      return resultx (resultx'high-1 downto resultx'low);  -- remove extra bit
    end if;
  end function reciprocal;

  -- ufixed (a downto b) rem ufixed (c downto d)
  --        = ufixed (min(a,c) downto min(b,d))
  function "rem" (
    l, r : ufixed)                      -- fixed point input
    return ufixed is
  begin
    return remainder (l            => l,
                       r           => r,
                       round_style => fixed_round_style);
  end function "rem";

  -- remainder
  -- sfixed (a downto b) rem sfixed (c downto d)
  --        = sfixed (min(a,c) downto min(b,d))
  function "rem" (
    l, r : sfixed)                      -- fixed point input
    return sfixed is
  begin
    return remainder (l            => l,
                       r           => r,
                       round_style => fixed_round_style);
  end function "rem";

  -- ufixed (a downto b) rem ufixed (c downto d)
  --        = ufixed (min(a,c) downto min(b,d))
  function remainder (
    l, r                 : ufixed;                    -- fixed point input
    constant round_style : BOOLEAN := fixed_round_style)
    return ufixed is
    variable result     : ufixed (minimum(l'high, r'high) downto mine(l'low, r'low));
    variable dresult    : ufixed (r'high downto r'low);
    variable lresize    : ufixed (maximum(l'high, r'low) downto mins(r'low, r'low));
    variable lslv       : UNSIGNED (lresize'length-1 downto 0);
    variable rslv       : UNSIGNED (r'length-1 downto 0);
    variable result_slv : UNSIGNED (rslv'range);
  begin
    if (l'length < 1 or r'length < 1 or
        mins(r'low, r'low) /= r'low or mins(l'low, l'low) /= l'low) then
      return NAUF;
    end if;
    lresize := resize (arg            => l,
                       left_index     => lresize'high,
                       right_index    => lresize'low,
                       overflow_style => fixed_wrap,  -- vector only grows
                       round_style    => fixed_truncate);
    lslv := to_uns (lresize);
    rslv := to_uns (cleanvec(r));
    if (rslv = 0) then
      report "FIXED_GENERIC_PKG.rem uFixed point Division by zero" severity error;
      result := saturate (result'high, result'low);   -- saturate
    else
      if (r'low <= l'high) then
        result_slv := lslv rem rslv;
        dresult    := to_fixed (result_slv, dresult'high, dresult'low);
        result := resize (arg             => dresult,
                           left_index     => result'high,
                           right_index    => result'low,
                           overflow_style => fixed_wrap,
                           round_style    => round_style);
--        result(result'high downto r'low) := dresult(result'high downto r'low);
      end if;
      if l'low < r'low then
        result(mins(r'low-1, l'high) downto l'low) :=
          cleanvec(l(mins(r'low-1, l'high) downto l'low));
      end if;
    end if;
    return result;
  end function remainder;

  -- remainder
  -- sfixed (a downto b) rem sfixed (c downto d)
  --        = sfixed (min(a,c) downto min(b,d))
  function remainder (
    l, r                 : sfixed;      -- fixed point input
    constant round_style : BOOLEAN := fixed_round_style)
    return sfixed is
    variable l_abs      : ufixed (l'range);
    variable r_abs      : ufixed (r'range);
    variable result     : sfixed (minimum(r'high, l'high) downto mine(r'low, l'low));
    variable neg_result : sfixed (minimum(r'high, l'high)+1 downto mins(r'low, l'low));
  begin
    if (l'length < 1 or r'length < 1 or
        mins(r'low, r'low) /= r'low or mins(l'low, l'low) /= l'low) then
      return NASF;
    end if;
    l_abs := abs(l);
    r_abs := abs(r);
    result := sfixed(remainder (l           => l_abs,
                                r           => r_abs,
                                round_style => round_style));
    neg_result := -result;
    if l(l'high) = '1' then
      result := neg_result(result'range);
    end if;
    return result;
  end function remainder;

  -- modulo
  -- ufixed (a downto b) mod ufixed (c downto d)
  --        = ufixed (min(a,c) downto min(b, d))
  function "mod" (
    l, r : ufixed)                      -- fixed point input
    return ufixed is
  begin
    return modulo (l           => l,
                   r           => r,
                   round_style => fixed_round_style);
  end function "mod";

  -- sfixed (a downto b) mod sfixed (c downto d)
  --        = sfixed (c downto min(b, d))
  function "mod" (
    l, r : sfixed)                      -- fixed point input
    return sfixed is
  begin
    return modulo(l           => l,
                  r           => r,
                  round_style => fixed_round_style);
  end function "mod";

  -- modulo
  -- ufixed (a downto b) mod ufixed (c downto d)
  --        = ufixed (min(a,c) downto min(b, d))
  function modulo (
    l, r                 : ufixed;      -- fixed point input
    constant round_style : BOOLEAN := fixed_round_style)
    return ufixed is
  begin
    return remainder(l           => l,
                     r           => r,
                     round_style => round_style);
  end function modulo;

  -- sfixed (a downto b) mod sfixed (c downto d)
  --        = sfixed (c downto min(b, d))
  function modulo (
    l, r                    : sfixed;   -- fixed point input
    constant overflow_style : BOOLEAN := fixed_overflow_style;
    constant round_style    : BOOLEAN := fixed_round_style)
    return sfixed is
    variable l_abs : ufixed (l'range);
    variable r_abs : ufixed (r'range);
    variable result : sfixed (r'high downto
                              mine(r'low, l'low));
    variable dresult : sfixed (minimum(r'high, l'high)+1 downto
                               mins(r'low, l'low));
    variable dresult_not_zero : BOOLEAN;
  begin
    if (l'length < 1 or r'length < 1 or
        mins(r'low, r'low) /= r'low or mins(l'low, l'low) /= l'low) then
      return NASF;
    end if;
    l_abs := abs(l);
    r_abs := abs(r);
    dresult := "0" & sfixed(remainder (l           => l_abs,
                                       r           => r_abs,
                                       round_style => round_style));
    if (to_s(dresult) = 0) then
      dresult_not_zero := false;
    else
      dresult_not_zero := true;
    end if;
    if to_x01(l(l'high)) = '1' and to_x01(r(r'high)) = '0'
      and dresult_not_zero then
      result := resize (arg             => r - dresult,
                         left_index     => result'high,
                         right_index    => result'low,
                         overflow_style => overflow_style,
                         round_style    => round_style);
    elsif to_x01(l(l'high)) = '1' and to_x01(r(r'high)) = '1' then
      result := resize (arg            => -dresult,
                        left_index     => result'high,
                        right_index    => result'low,
                        overflow_style => overflow_style,
                        round_style    => round_style);
    elsif to_x01(l(l'high)) = '0' and to_x01(r(r'high)) = '1'
      and dresult_not_zero then
      result := resize (arg            => dresult + r,
                        left_index     => result'high,
                        right_index    => result'low,
                        overflow_style => overflow_style,
                        round_style    => round_style);
    else
      result := resize (arg            => dresult,
                        left_index     => result'high,
                        right_index    => result'low,
                        overflow_style => overflow_style,
                        round_style    => round_style);
    end if;
    return result;
  end function modulo;

  -- Procedure for those who need an "accumulator" function
  procedure add_carry (
    L, R   : in  ufixed;
    c_in   : in  STD_ULOGIC;
    result : out ufixed;
    c_out  : out STD_ULOGIC) is
    constant left_index       : INTEGER := maximum(l'high, r'high)+1;
    constant right_index      : INTEGER := mins(l'low, r'low);
    variable lresize, rresize : ufixed (left_index downto right_index);
    variable lslv, rslv : UNSIGNED (left_index-right_index
                                    downto 0);
    variable result_slv : UNSIGNED (left_index-right_index
                                    downto 0);
    variable cx : UNSIGNED (0 downto 0);  -- Carry in
  begin
    if (l'length < 1 or r'length < 1) then
      result := NAUF;
      c_out  := '0';
    else
      cx (0)     := c_in;
      lresize    := resize (l, left_index, right_index);
      rresize    := resize (r, left_index, right_index);
      lslv       := to_uns (lresize);
      rslv       := to_uns (rresize);
      result_slv := lslv + rslv + cx;
      c_out      := result_slv(left_index);
      result := to_fixed(result_slv (left_index-right_index-1 downto 0),
                             left_index-1, right_index);
    end if;
  end procedure add_carry;

  procedure add_carry (
    L, R   : in  sfixed;
    c_in   : in  STD_ULOGIC;
    result : out sfixed;
    c_out  : out STD_ULOGIC) is
    constant left_index       : INTEGER := maximum(l'high, r'high)+1;
    constant right_index      : INTEGER := mins(l'low, r'low);
    variable lresize, rresize : sfixed (left_index downto right_index);
    variable lslv, rslv : SIGNED (left_index-right_index
                                  downto 0);
    variable result_slv : SIGNED (left_index-right_index
                                  downto 0);
    variable cx : SIGNED (1 downto 0);  -- Carry in
  begin
    if (l'length < 1 or r'length < 1) then
      result := NASF;
      c_out  := '0';
    else
      cx (1)     := '0';
      cx (0)     := c_in;
      lresize    := resize (l, left_index, right_index);
      rresize    := resize (r, left_index, right_index);
      lslv       := to_s (lresize);
      rslv       := to_s (rresize);
      result_slv := lslv + rslv + cx;
      c_out      := result_slv(left_index);
      result := to_fixed(result_slv (left_index-right_index-1 downto 0),
                             left_index-1, right_index);
    end if;
  end procedure add_carry;

  -- Scales the result by a power of 2.  Width of input = width of output with
  -- the decimal point moved.
  function scalb (y : ufixed; N : integer) return ufixed is
    variable result : ufixed (y'high+N downto y'low+N);
  begin
    if y'length < 1 then
      return NAUF;
    else
      result := y;
      return result;
    end if;
  end function scalb;

  function scalb (y : ufixed; N : SIGNED) return ufixed is
  begin
    return scalb (y => y,
                  N => to_integer(N));
  end function scalb;

  function scalb (y : sfixed; N : integer) return sfixed is
    variable result : sfixed (y'high+N downto y'low+N);
  begin
    if y'length < 1 then
      return NASF;
    else
      result := y;
      return result;
    end if;
  end function scalb;

  function scalb (y : sfixed; N : SIGNED) return sfixed is
  begin
    return scalb (y => y,
                  N => to_integer(N));
  end function scalb;
  
  function Is_Negative (arg : sfixed) return BOOLEAN is
  begin
    if to_X01(arg(arg'high)) = '1' then
      return true;
    else
      return false;
    end if;
  end function Is_Negative;

  function find_lsb (arg : ufixed; y : STD_ULOGIC) return INTEGER is
  begin
    for_loop : for i in arg'low to arg'high loop
      if arg(i) = y then
        return i;
      end if;
    end loop;
    return arg'high+1;                  -- return out of bounds 'high
  end function find_lsb;

  function find_msb (arg : ufixed; y : STD_ULOGIC) return INTEGER is
  begin
    for_loop : for i in arg'high downto arg'low loop
      if arg(i) = y then
        return i;
      end if;
    end loop;
    return arg'low-1;                   -- return out of bounds 'low
  end function find_msb;

  function find_lsb (arg : sfixed; y : STD_ULOGIC) return INTEGER is
  begin
    for_loop : for i in arg'low to arg'high loop
      if arg(i) = y then
        return i;
      end if;
    end loop;
    return arg'high+1;                  -- return out of bounds 'high
  end function find_lsb;

  function find_msb (arg : sfixed; y : STD_ULOGIC) return INTEGER is
  begin
    for_loop : for i in arg'high downto arg'low loop
      if arg(i) = y then
        return i;
      end if;
    end loop;
    return arg'low-1;                   -- return out of bounds 'low
  end function find_msb;

  function "sll" (ARG : ufixed; COUNT : INTEGER) return ufixed is
    variable argslv : UNSIGNED (arg'length-1 downto 0);
    variable result : ufixed (arg'range);
  begin
    argslv := to_uns (arg);
    argslv := argslv sll COUNT;
    result := to_fixed (argslv, result'high, result'low);
    return result;
  end function "sll";

  function "srl" (ARG : ufixed; COUNT : INTEGER) return ufixed is
    variable argslv : UNSIGNED (arg'length-1 downto 0);
    variable result : ufixed (arg'range);
  begin
    argslv := to_uns (arg);
    argslv := argslv srl COUNT;
    result := to_fixed (argslv, result'high, result'low);
    return result;
  end function "srl";

  function "rol" (ARG : ufixed; COUNT : INTEGER) return ufixed is
    variable argslv : UNSIGNED (arg'length-1 downto 0);
    variable result : ufixed (arg'range);
  begin
    argslv := to_uns (arg);
    argslv := argslv rol COUNT;
    result := to_fixed (argslv, result'high, result'low);
    return result;
  end function "rol";

  function "ror" (ARG : ufixed; COUNT : INTEGER) return ufixed is
    variable argslv : UNSIGNED (arg'length-1 downto 0);
    variable result : ufixed (arg'range);
  begin
    argslv := to_uns (arg);
    argslv := argslv ror COUNT;
    result := to_fixed (argslv, result'high, result'low);
    return result;
  end function "ror";

  function "sla" (ARG : ufixed; COUNT : INTEGER) return ufixed is
    variable argslv : UNSIGNED (arg'length-1 downto 0);
    variable result : ufixed (arg'range);
  begin
    argslv := to_uns (arg);
    -- Arithmetic shift on an unsigned is a logical shift
    argslv := argslv sll COUNT;
    result := to_fixed (argslv, result'high, result'low);
    return result;
  end function "sla";

  function "sra" (ARG : ufixed; COUNT : INTEGER) return ufixed is
    variable argslv : UNSIGNED (arg'length-1 downto 0);
    variable result : ufixed (arg'range);
  begin
    argslv := to_uns (arg);
    -- Arithmetic shift on an unsigned is a logical shift
    argslv := argslv srl COUNT;
    result := to_fixed (argslv, result'high, result'low);
    return result;
  end function "sra";

  function "sll" (ARG : sfixed; COUNT : INTEGER) return sfixed is
    variable argslv : SIGNED (arg'length-1 downto 0);
    variable result : sfixed (arg'range);
  begin
    argslv := to_s (arg);
    argslv := argslv sll COUNT;
    result := to_fixed (argslv, result'high, result'low);
    return result;
  end function "sll";

  function "srl" (ARG : sfixed; COUNT : INTEGER) return sfixed is
    variable argslv : SIGNED (arg'length-1 downto 0);
    variable result : sfixed (arg'range);
  begin
    argslv := to_s (arg);
    argslv := argslv srl COUNT;
    result := to_fixed (argslv, result'high, result'low);
    return result;
  end function "srl";

  function "rol" (ARG : sfixed; COUNT : INTEGER) return sfixed is
    variable argslv : SIGNED (arg'length-1 downto 0);
    variable result : sfixed (arg'range);
  begin
    argslv := to_s (arg);
    argslv := argslv rol COUNT;
    result := to_fixed (argslv, result'high, result'low);
    return result;
  end function "rol";

  function "ror" (ARG : sfixed; COUNT : INTEGER) return sfixed is
    variable argslv : SIGNED (arg'length-1 downto 0);
    variable result : sfixed (arg'range);
  begin
    argslv := to_s (arg);
    argslv := argslv ror COUNT;
    result := to_fixed (argslv, result'high, result'low);
    return result;
  end function "ror";

  function "sla" (ARG : sfixed; COUNT : INTEGER) return sfixed is
    variable argslv : SIGNED (arg'length-1 downto 0);
    variable result : sfixed (arg'range);
  begin
    argslv := to_s (arg);
    if COUNT > 0 then
      -- Arithmetic shift left on a 2's complement number is a logic shift
      argslv := argslv sll COUNT;
    else
      argslv := argslv sra -COUNT;
    end if;
    result := to_fixed (argslv, result'high, result'low);
    return result;
  end function "sla";

  function "sra" (ARG : sfixed; COUNT : INTEGER) return sfixed is
    variable argslv : SIGNED (arg'length-1 downto 0);
    variable result : sfixed (arg'range);
  begin
    argslv := to_s (arg);
    if COUNT > 0 then
      argslv := argslv sra COUNT;
    else
      -- Arithmetic shift left on a 2's complement number is a logic shift
      argslv := argslv sll -COUNT;
    end if;
    result := to_fixed (argslv, result'high, result'low);
    return result;
  end function "sra";

  -- Because some people want the older functions.
  function SHIFT_LEFT (ARG : ufixed; COUNT : NATURAL) return ufixed is
  begin
    if (ARG'length < 1) then
      return NAUF;
    end if;
    return ARG sla COUNT;
  end function SHIFT_LEFT;
  function SHIFT_RIGHT (ARG : ufixed; COUNT : NATURAL) return ufixed is
  begin
    if (ARG'length < 1) then
      return NAUF;
    end if;
    return ARG sra COUNT;
  end function SHIFT_RIGHT;
  function SHIFT_LEFT (ARG : sfixed; COUNT : NATURAL) return sfixed is
  begin
    if (ARG'length < 1) then
      return NASF;
    end if;
    return ARG sla COUNT;
  end function SHIFT_LEFT;
  function SHIFT_RIGHT (ARG : sfixed; COUNT : NATURAL) return sfixed is
  begin
    if (ARG'length < 1) then
      return NASF;
    end if;
    return ARG sra COUNT;
  end function SHIFT_RIGHT;

  ----------------------------------------------------------------------------
  -- logical functions
  ----------------------------------------------------------------------------
  function "not" (L : ufixed) return ufixed is
    variable RESULT : STD_LOGIC_VECTOR(L'length-1 downto 0);  -- force downto
  begin
    RESULT := not to_slv(L);
    return to_ufixed(RESULT, L'high, L'low);
  end function "not";

  function "and" (L, R : ufixed) return ufixed is
    variable RESULT : STD_LOGIC_VECTOR(L'length-1 downto 0);  -- force downto
  begin
    if (L'high = R'high and L'low = R'low) then
      RESULT := to_slv(L) and to_slv(R);
    else
      report "FIXED_GENERIC_PKG.""and"": Range error L'RANGE /= R'RANGE"
        severity warning;
      RESULT := (others => 'U');
    end if;
    return to_ufixed(RESULT, L'high, L'low);
  end function "and";

  function "or" (L, R : ufixed) return ufixed is
    variable RESULT : STD_LOGIC_VECTOR(L'length-1 downto 0);  -- force downto
  begin
    if (L'high = R'high and L'low = R'low) then
      RESULT := to_slv(L) or to_slv(R);
    else
      report "FIXED_GENERIC_PKG.""or"": Range error L'RANGE /= R'RANGE"
        severity warning;
      RESULT := (others => 'U');
    end if;
    return to_ufixed(RESULT, L'high, L'low);
  end function "or";

  function "nand" (L, R : ufixed) return ufixed is
    variable RESULT : STD_LOGIC_VECTOR(L'length-1 downto 0);  -- force downto
  begin
    if (L'high = R'high and L'low = R'low) then
      RESULT := to_slv(L) nand to_slv(R);
    else
      report "FIXED_GENERIC_PKG.""nand"": Range error L'RANGE /= R'RANGE"
        severity warning;
      RESULT := (others => 'U');
    end if;
    return to_ufixed(RESULT, L'high, L'low);
  end function "nand";

  function "nor" (L, R : ufixed) return ufixed is
    variable RESULT : STD_LOGIC_VECTOR(L'length-1 downto 0);  -- force downto
  begin
    if (L'high = R'high and L'low = R'low) then
      RESULT := to_slv(L) nor to_slv(R);
    else
      report "FIXED_GENERIC_PKG.""nor"": Range error L'RANGE /= R'RANGE"
        severity warning;
      RESULT := (others => 'U');
    end if;
    return to_ufixed(RESULT, L'high, L'low);
  end function "nor";

  function "xor" (L, R : ufixed) return ufixed is
    variable RESULT : STD_LOGIC_VECTOR(L'length-1 downto 0);  -- force downto
  begin
    if (L'high = R'high and L'low = R'low) then
      RESULT := to_slv(L) xor to_slv(R);
    else
      report "FIXED_GENERIC_PKG.""xor"": Range error L'RANGE /= R'RANGE"
        severity warning;
      RESULT := (others => 'U');
    end if;
    return to_ufixed(RESULT, L'high, L'low);
  end function "xor";

  function "xnor" (L, R : ufixed) return ufixed is
    variable RESULT : STD_LOGIC_VECTOR(L'length-1 downto 0);  -- force downto
  begin
    if (L'high = R'high and L'low = R'low) then
      RESULT := to_slv(L) xnor to_slv(R);
    else
      report "FIXED_GENERIC_PKG.""xnor"": Range error L'RANGE /= R'RANGE"
        severity warning;
      RESULT := (others => 'U');
    end if;
    return to_ufixed(RESULT, L'high, L'low);
  end function "xnor";

  function "not" (L : sfixed) return sfixed is
    variable RESULT : STD_LOGIC_VECTOR(L'length-1 downto 0);  -- force downto
  begin
    RESULT := not to_slv(L);
    return to_sfixed(RESULT, L'high, L'low);
  end function "not";

  function "and" (L, R : sfixed) return sfixed is
    variable RESULT : STD_LOGIC_VECTOR(L'length-1 downto 0);  -- force downto
  begin
    if (L'high = R'high and L'low = R'low) then
      RESULT := to_slv(L) and to_slv(R);
    else
      report "FIXED_GENERIC_PKG.""and"": Range error L'RANGE /= R'RANGE"
        severity warning;
      RESULT := (others => 'U');
    end if;
    return to_sfixed(RESULT, L'high, L'low);
  end function "and";

  function "or" (L, R : sfixed) return sfixed is
    variable RESULT : STD_LOGIC_VECTOR(L'length-1 downto 0);  -- force downto
  begin
    if (L'high = R'high and L'low = R'low) then
      RESULT := to_slv(L) or to_slv(R);
    else
      report "FIXED_GENERIC_PKG.""or"": Range error L'RANGE /= R'RANGE"
        severity warning;
      RESULT := (others => 'U');
    end if;
    return to_sfixed(RESULT, L'high, L'low);
  end function "or";

  function "nand" (L, R : sfixed) return sfixed is
    variable RESULT : STD_LOGIC_VECTOR(L'length-1 downto 0);  -- force downto
  begin
    if (L'high = R'high and L'low = R'low) then
      RESULT := to_slv(L) nand to_slv(R);
    else
      report "FIXED_GENERIC_PKG.""nand"": Range error L'RANGE /= R'RANGE"
        severity warning;
      RESULT := (others => 'U');
    end if;
    return to_sfixed(RESULT, L'high, L'low);
  end function "nand";

  function "nor" (L, R : sfixed) return sfixed is
    variable RESULT : STD_LOGIC_VECTOR(L'length-1 downto 0);  -- force downto
  begin
    if (L'high = R'high and L'low = R'low) then
      RESULT := to_slv(L) nor to_slv(R);
    else
      report "FIXED_GENERIC_PKG.""nor"": Range error L'RANGE /= R'RANGE"
        severity warning;
      RESULT := (others => 'U');
    end if;
    return to_sfixed(RESULT, L'high, L'low);
  end function "nor";

  function "xor" (L, R : sfixed) return sfixed is
    variable RESULT : STD_LOGIC_VECTOR(L'length-1 downto 0);  -- force downto
  begin
    if (L'high = R'high and L'low = R'low) then
      RESULT := to_slv(L) xor to_slv(R);
    else
      report "FIXED_GENERIC_PKG.""xor"": Range error L'RANGE /= R'RANGE"
        severity warning;
      RESULT := (others => 'U');
    end if;
    return to_sfixed(RESULT, L'high, L'low);
  end function "xor";

  function "xnor" (L, R : sfixed) return sfixed is
    variable RESULT : STD_LOGIC_VECTOR(L'length-1 downto 0);  -- force downto
  begin
    if (L'high = R'high and L'low = R'low) then
      RESULT := to_slv(L) xnor to_slv(R);
    else
      report "FIXED_GENERIC_PKG.""xnor"": Range error L'RANGE /= R'RANGE"
        severity warning;
      RESULT := (others => 'U');
    end if;
    return to_sfixed(RESULT, L'high, L'low);
  end function "xnor";

  -- Vector and std_ulogic functions, same as functions in numeric_std
  function "and" (L : STD_ULOGIC; R : ufixed) return ufixed is
    variable result : ufixed (R'range);
  begin
    for i in result'range loop
      result(i) := L and R(i);
    end loop;
    return result;
  end function "and";

  function "and" (L : ufixed; R : STD_ULOGIC) return ufixed is
    variable result : ufixed (L'range);
  begin
    for i in result'range loop
      result(i) := L(i) and R;
    end loop;
    return result;
  end function "and";

  function "or" (L : STD_ULOGIC; R : ufixed) return ufixed is
    variable result : ufixed (R'range);
  begin
    for i in result'range loop
      result(i) := L or R(i);
    end loop;
    return result;
  end function "or";

  function "or" (L : ufixed; R : STD_ULOGIC) return ufixed is
    variable result : ufixed (L'range);
  begin
    for i in result'range loop
      result(i) := L(i) or R;
    end loop;
    return result;
  end function "or";

  function "nand" (L : STD_ULOGIC; R : ufixed) return ufixed is
    variable result : ufixed (R'range);
  begin
    for i in result'range loop
      result(i) := L nand R(i);
    end loop;
    return result;
  end function "nand";

  function "nand" (L : ufixed; R : STD_ULOGIC) return ufixed is
    variable result : ufixed (L'range);
  begin
    for i in result'range loop
      result(i) := L(i) nand R;
    end loop;
    return result;
  end function "nand";

  function "nor" (L : STD_ULOGIC; R : ufixed) return ufixed is
    variable result : ufixed (R'range);
  begin
    for i in result'range loop
      result(i) := L nor R(i);
    end loop;
    return result;
  end function "nor";

  function "nor" (L : ufixed; R : STD_ULOGIC) return ufixed is
    variable result : ufixed (L'range);
  begin
    for i in result'range loop
      result(i) := L(i) nor R;
    end loop;
    return result;
  end function "nor";

  function "xor" (L : STD_ULOGIC; R : ufixed) return ufixed is
    variable result : ufixed (R'range);
  begin
    for i in result'range loop
      result(i) := L xor R(i);
    end loop;
    return result;
  end function "xor";

  function "xor" (L : ufixed; R : STD_ULOGIC) return ufixed is
    variable result : ufixed (L'range);
  begin
    for i in result'range loop
      result(i) := L(i) xor R;
    end loop;
    return result;
  end function "xor";

  function "xnor" (L : STD_ULOGIC; R : ufixed) return ufixed is
    variable result : ufixed (R'range);
  begin
    for i in result'range loop
      result(i) := L xnor R(i);
    end loop;
    return result;
  end function "xnor";

  function "xnor" (L : ufixed; R : STD_ULOGIC) return ufixed is
    variable result : ufixed (L'range);
  begin
    for i in result'range loop
      result(i) := L(i) xnor R;
    end loop;
    return result;
  end function "xnor";

  function "and" (L : STD_ULOGIC; R : sfixed) return sfixed is
    variable result : sfixed (R'range);
  begin
    for i in result'range loop
      result(i) := L and R(i);
    end loop;
    return result;
  end function "and";

  function "and" (L : sfixed; R : STD_ULOGIC) return sfixed is
    variable result : sfixed (L'range);
  begin
    for i in result'range loop
      result(i) := L(i) and R;
    end loop;
    return result;
  end function "and";

  function "or" (L : STD_ULOGIC; R : sfixed) return sfixed is
    variable result : sfixed (R'range);
  begin
    for i in result'range loop
      result(i) := L or R(i);
    end loop;
    return result;
  end function "or";

  function "or" (L : sfixed; R : STD_ULOGIC) return sfixed is
    variable result : sfixed (L'range);
  begin
    for i in result'range loop
      result(i) := L(i) or R;
    end loop;
    return result;
  end function "or";

  function "nand" (L : STD_ULOGIC; R : sfixed) return sfixed is
    variable result : sfixed (R'range);
  begin
    for i in result'range loop
      result(i) := L nand R(i);
    end loop;
    return result;
  end function "nand";

  function "nand" (L : sfixed; R : STD_ULOGIC) return sfixed is
    variable result : sfixed (L'range);
  begin
    for i in result'range loop
      result(i) := L(i) nand R;
    end loop;
    return result;
  end function "nand";

  function "nor" (L : STD_ULOGIC; R : sfixed) return sfixed is
    variable result : sfixed (R'range);
  begin
    for i in result'range loop
      result(i) := L nor R(i);
    end loop;
    return result;
  end function "nor";

  function "nor" (L : sfixed; R : STD_ULOGIC) return sfixed is
    variable result : sfixed (L'range);
  begin
    for i in result'range loop
      result(i) := L(i) nor R;
    end loop;
    return result;
  end function "nor";

  function "xor" (L : STD_ULOGIC; R : sfixed) return sfixed is
    variable result : sfixed (R'range);
  begin
    for i in result'range loop
      result(i) := L xor R(i);
    end loop;
    return result;
  end function "xor";

  function "xor" (L : sfixed; R : STD_ULOGIC) return sfixed is
    variable result : sfixed (L'range);
  begin
    for i in result'range loop
      result(i) := L(i) xor R;
    end loop;
    return result;
  end function "xor";

  function "xnor" (L : STD_ULOGIC; R : sfixed) return sfixed is
    variable result : sfixed (R'range);
  begin
    for i in result'range loop
      result(i) := L xnor R(i);
    end loop;
    return result;
  end function "xnor";

  function "xnor" (L : sfixed; R : STD_ULOGIC) return sfixed is
    variable result : sfixed (L'range);
  begin
    for i in result'range loop
      result(i) := L(i) xnor R;
    end loop;
    return result;
  end function "xnor";

  -- Reduction operators, same as numeric_std functions
  -- %%% remove 12 functions (old syntax)
  function and_reduce(arg : ufixed) return STD_ULOGIC is
  begin
    return and_reducex (to_slv(arg));
  end function and_reduce;

  function nand_reduce(arg : ufixed) return STD_ULOGIC is
  begin
    return not and_reducex (to_slv(arg));
  end function nand_reduce;

  function or_reduce(arg : ufixed) return STD_ULOGIC is
  begin
    return or_reducex (to_slv(arg));
  end function or_reduce;

  function nor_reduce(arg : ufixed) return STD_ULOGIC is
  begin
    return not or_reducex (to_slv(arg));
  end function nor_reduce;

  function xor_reduce(arg : ufixed) return STD_ULOGIC is
  begin
    return xor_reducex (to_slv(arg));
  end function xor_reduce;

  function xnor_reduce(arg : ufixed) return STD_ULOGIC is
  begin
    return not xor_reducex (to_slv(arg));
  end function xnor_reduce;

  function and_reduce(arg : sfixed) return STD_ULOGIC is
  begin
    return and_reducex (to_slv(arg));
  end function and_reduce;

  function nand_reduce(arg : sfixed) return STD_ULOGIC is
  begin
    return not and_reducex (to_slv(arg));
  end function nand_reduce;

  function or_reduce(arg : sfixed) return STD_ULOGIC is
  begin
    return or_reducex (to_slv(arg));
  end function or_reduce;

  function nor_reduce(arg : sfixed) return STD_ULOGIC is
  begin
    return not or_reducex (to_slv(arg));
  end function nor_reduce;

  function xor_reduce(arg : sfixed) return STD_ULOGIC is
  begin
    return xor_reducex (to_slv(arg));
  end function xor_reduce;

  function xnor_reduce(arg : sfixed) return STD_ULOGIC is
  begin
    return not xor_reducex (to_slv(arg));
  end function xnor_reduce;
  -- %%% Uncomment the following 12 functions (new syntax)
  -- function "and" ( arg  : ufixed ) RETURN std_ulogic is
  -- begin
  --   return and to_slv(arg);
  -- end function "and";
  -- function "nand" ( arg  : ufixed ) RETURN std_ulogic is
  -- begin
  --   return nand to_slv(arg);
  -- end function "nand";;
  -- function "or" ( arg  : ufixed ) RETURN std_ulogic is
  -- begin
  --   return or to_slv(arg);
  -- end function "or";
  -- function "nor" ( arg  : ufixed ) RETURN std_ulogic is
  -- begin
  --   return nor to_slv(arg);
  -- end function "nor";
  -- function "xor" ( arg  : ufixed ) RETURN std_ulogic is
  -- begin
  --   return xor to_slv(arg);
  -- end function "xor";
  -- function "xnor" ( arg  : ufixed ) RETURN std_ulogic is
  -- begin
  --   return xnor to_slv(arg);
  -- end function "xnor";
  -- function "and" ( arg  : sfixed ) RETURN std_ulogic is
  -- begin
  --   return and to_slv(arg);
  -- end function "and";;
  -- function "nand" ( arg  : sfixed ) RETURN std_ulogic is
  -- begin
  --   return nand to_slv(arg);
  -- end function "nand";;
  -- function "or" ( arg  : sfixed ) RETURN std_ulogic is
  -- begin
  --   return or to_slv(arg);
  -- end function "or";
  -- function "nor" ( arg  : sfixed ) RETURN std_ulogic is
  -- begin
  --   return nor to_slv(arg);
  -- end function "nor";
  -- function "xor" ( arg  : sfixed ) RETURN std_ulogic is
  -- begin
  --   return xor to_slv(arg);
  -- end function "xor";
  -- function "xnor" ( arg  : sfixed ) RETURN std_ulogic is
  -- begin
  --   return xnor to_slv(arg);
  -- end function "xnor";

  -- %%% Replace with the following (new syntax)
--  function "?="  (L, R : ufixed) return STD_ULOGIC is
  function \?=\ (L, R : ufixed) return STD_ULOGIC is
    constant left_index       : INTEGER := maximum(l'high, r'high);
    constant right_index      : INTEGER := mins(l'low, r'low);
    variable lresize, rresize : ufixed (left_index downto right_index);
    variable result, result1  : STD_ULOGIC;          -- result
  begin  -- ?=
    if ((L'LENGTH < 1) or (R'LENGTH < 1)) then
      assert NO_WARNING
        report "FIXED_GENERIC_PKG.""?="": null detected, returning X"
        severity warning;
      return 'X';
    else
      lresize := resize (l, left_index, right_index);
      rresize := resize (r, left_index, right_index);
      result := '1';
      for i in lresize'reverse_range loop
        result1 := \?=\(lresize(i), rresize(i));
        if result1 = 'U' then
          return 'U';
        elsif result1 = 'X' or result = 'X' then
          result := 'X';
        else
          result := result and result1;
        end if;
      end loop;
      return result;
    end if;
  end function \?=\;
--  end function "?=";

--  function "?/=" (L, R : ufixed) return STD_ULOGIC is
  function \?/=\ (L, R : ufixed) return STD_ULOGIC is
    constant left_index       : INTEGER := maximum(l'high, r'high);
    constant right_index      : INTEGER := mins(l'low, r'low);
    variable lresize, rresize : ufixed (left_index downto right_index);
    variable result, result1  : STD_ULOGIC;                -- result
  begin  -- ?/=
    if ((L'LENGTH < 1) or (R'LENGTH < 1)) then
      assert NO_WARNING
        report "FIXED_GENERIC_PKG.""?/="": null detected, returning X"
        severity warning;
      return 'X';
    else
      lresize := resize (l, left_index, right_index);
      rresize := resize (r, left_index, right_index);
      result := '0';
      for i in lresize'reverse_range loop
        result1 := \?/=\ (lresize(i), rresize(i));
        if result1 = 'U' then
          return 'U';
        elsif result1 = 'X' or result = 'X' then
          result := 'X';
        else
          result := result or result1;
        end if;
      end loop;
      return result;
    end if;
  end function \?/=\;
--  end function "?/=";

--  function "?>"  (L, R : ufixed) return STD_ULOGIC is
  function \?>\  (L, R : ufixed) return STD_ULOGIC is
  begin  -- ?>
    if ((l'length < 1) or (r'length < 1)) then
      assert NO_WARNING
        report "FIXED_GENERIC_PKG.""?>"": null detected, returning X"
        severity warning;
      return 'X';
    elsif (find_msb (l, '-') /= l'low-1) or (find_msb (r, '-') /= r'low-1) then
      report "FIXED_GENERIC_PKG.""?>"": '-' found in compare string"
        severity error;
      return 'X';
    else
      if is_x(l) or is_x(r) then
        return 'X';
      elsif l > r then
        return '1';
      else
        return '0';
      end if;
    end if;
  end function \?>\;
--  end function "?>";

--  function "?>=" (L, R : ufixed) return STD_ULOGIC is
  function \?>=\ (L, R : ufixed) return STD_ULOGIC is
  begin  -- ?>=
    if ((l'length < 1) or (r'length < 1)) then
      assert NO_WARNING
        report "FIXED_GENERIC_PKG.""?>="": null detected, returning X"
        severity warning;
      return 'X';
    elsif (find_msb (l, '-') /= l'low-1) or (find_msb (r, '-') /= r'low-1) then
      report "FIXED_GENERIC_PKG.""?>="": '-' found in compare string"
        severity error;
      return 'X';
    else
      if is_x(l) or is_x(r) then
        return 'X';
      elsif l >= r then
        return '1';
      else
        return '0';
      end if;
    end if;
  end function \?>=\;
--  end function "?>=";

--  function "?<"  (L, R : ufixed) return STD_ULOGIC is
  function \?<\  (L, R : ufixed) return STD_ULOGIC is
  begin  -- ?<
    if ((l'length < 1) or (r'length < 1)) then
      assert NO_WARNING
        report "FIXED_GENERIC_PKG.""?<"": null detected, returning X"
        severity warning;
      return 'X';
    elsif (find_msb (l, '-') /= l'low-1) or (find_msb (r, '-') /= r'low-1) then
      report "FIXED_GENERIC_PKG.""?<"": '-' found in compare string"
        severity error;
      return 'X';
    else
      if is_x(l) or is_x(r) then
        return 'X';
      elsif l < r then
        return '1';
      else
        return '0';
      end if;
    end if;
  end function \?<\;
--  end function "?<";

--  function "?<=" (L, R : ufixed) return STD_ULOGIC is
  function \?<=\ (L, R : ufixed) return STD_ULOGIC is
  begin  -- ?<=
    if ((l'length < 1) or (r'length < 1)) then
      assert NO_WARNING
        report "FIXED_GENERIC_PKG.""?<="": null detected, returning X"
        severity warning;
      return 'X';
    elsif (find_msb (l, '-') /= l'low-1) or (find_msb (r, '-') /= r'low-1) then
      report "FIXED_GENERIC_PKG.""?<="": '-' found in compare string"
        severity error;
      return 'X';
    else
      if is_x(l) or is_x(r) then
        return 'X';
      elsif l <= r then
        return '1';
      else
        return '0';
      end if;
    end if;
  end function \?<=\;
--  end function "?<=";

  --  function "?="  (L, R : sfixed) return STD_ULOGIC is
  function \?=\ (L, R : sfixed) return STD_ULOGIC is
    constant left_index       : INTEGER := maximum(l'high, r'high);
    constant right_index      : INTEGER := mins(l'low, r'low);
    variable lresize, rresize : sfixed (left_index downto right_index);
    variable result, result1  : STD_ULOGIC;               -- result
  begin  -- ?=
    if ((L'LENGTH < 1) or (R'LENGTH < 1)) then
      assert NO_WARNING
        report "FIXED_GENERIC_PKG.""?="": null detected, returning X"
        severity warning;
      return 'X';
    else
      lresize := resize (l, left_index, right_index);
      rresize := resize (r, left_index, right_index);
      result := '1';
      for i in lresize'reverse_range loop
        result1 := \?=\ (lresize(i), rresize(i));
        if result1 = 'U' then
          return 'U';
        elsif result1 = 'X' or result = 'X' then
          result := 'X';
        else
          result := result and result1;
        end if;
      end loop;
      return result;
    end if;
  end function \?=\;
--  end function "?=";

--  function "?/=" (L, R : sfixed) return STD_ULOGIC is
  function \?/=\ (L, R : sfixed) return STD_ULOGIC is
    constant left_index       : INTEGER := maximum(l'high, r'high);
    constant right_index      : INTEGER := mins(l'low, r'low);
    variable lresize, rresize : sfixed (left_index downto right_index);
    variable result, result1  : STD_ULOGIC;                    -- result
  begin  -- ?/=
    if ((L'LENGTH < 1) or (R'LENGTH < 1)) then
      assert NO_WARNING
        report "FIXED_GENERIC_PKG.""?/="": null detected, returning X"
        severity warning;
      return 'X';
    else
      lresize := resize (l, left_index, right_index);
      rresize := resize (r, left_index, right_index);
      result := '0';
      for i in lresize'reverse_range loop
        result1 := \?/=\ (lresize(i), rresize(i));
        if result1 = 'U' then
          return 'U';
        elsif result1 = 'X' or result = 'X' then
          result := 'X';
        else
          result := result or result1;
        end if;
      end loop;
      return result;
    end if;
  end function \?/=\;
--  end function "?/=";

--  function "?>"  (L, R : sfixed) return STD_ULOGIC is
  function \?>\  (L, R : sfixed) return STD_ULOGIC is
  begin  -- ?>
    if ((l'length < 1) or (r'length < 1)) then
      assert NO_WARNING
        report "FIXED_GENERIC_PKG.""?>"": null detected, returning X"
        severity warning;
      return 'X';
    elsif (find_msb (l, '-') /= l'low-1) or (find_msb (r, '-') /= r'low-1) then
      report "FIXED_GENERIC_PKG.""?>"": '-' found in compare string"
        severity error;
      return 'X';
    else
      if is_x(l) or is_x(r) then
        return 'X';
      elsif l > r then
        return '1';
      else
        return '0';
      end if;
    end if;
  end function \?>\;
--  end function "?>";

--  function "?>=" (L, R : sfixed) return STD_ULOGIC is
  function \?>=\ (L, R : sfixed) return STD_ULOGIC is
  begin  -- ?>=
    if ((l'length < 1) or (r'length < 1)) then
      assert NO_WARNING
        report "FIXED_GENERIC_PKG.""?>="": null detected, returning X"
        severity warning;
      return 'X';
    elsif (find_msb (l, '-') /= l'low-1) or (find_msb (r, '-') /= r'low-1) then
      report "FIXED_GENERIC_PKG.""?>="": '-' found in compare string"
        severity error;
      return 'X';
    else
      if is_x(l) or is_x(r) then
        return 'X';
      elsif l >= r then
        return '1';
      else
        return '0';
      end if;
    end if;
  end function \?>=\;
--  end function "?>=";

--  function "?<"  (L, R : sfixed) return STD_ULOGIC is
  function \?<\  (L, R : sfixed) return STD_ULOGIC is
  begin  -- ?<
    if ((l'length < 1) or (r'length < 1)) then
      assert NO_WARNING
        report "FIXED_GENERIC_PKG.""?<"": null detected, returning X"
        severity warning;
      return 'X';
    elsif (find_msb (l, '-') /= l'low-1) or (find_msb (r, '-') /= r'low-1) then
      report "FIXED_GENERIC_PKG.""?<"": '-' found in compare string"
        severity error;
      return 'X';
    else
      if is_x(l) or is_x(r) then
        return 'X';
      elsif l < r then
        return '1';
      else
        return '0';
      end if;
    end if;
  end function \?<\;
--  end function "?<";

--  function "?<=" (L, R : sfixed) return STD_ULOGIC is
  function \?<=\ (L, R : sfixed) return STD_ULOGIC is
  begin  -- ?<=
    if ((l'length < 1) or (r'length < 1)) then
      assert NO_WARNING
        report "FIXED_GENERIC_PKG.""?<="": null detected, returning X"
        severity warning;
      return 'X';
    elsif (find_msb (l, '-') /= l'low-1) or (find_msb (r, '-') /= r'low-1) then
      report "FIXED_GENERIC_PKG.""?<="": '-' found in compare string"
        severity error;
      return 'X';
    else
      if is_x(l) or is_x(r) then
        return 'X';
      elsif l <= r then
        return '1';
      else
        return '0';
      end if;
    end if;
  end function \?<=\;
--  end function "?<=";

  -- %%% end replace
  -- Match function, similar to "std_match" from numeric_std
  function std_match (L, R : ufixed) return BOOLEAN is
  begin
    if (L'high = R'high and L'low = R'low) then
      return std_match(to_slv(L), to_slv(R));
    else
      report "FIXED_GENERIC_PKG.STD_MATCH: L'RANGE /= R'RANGE, returning FALSE"
        severity warning;
      return false;
    end if;
  end function std_match;

  function std_match (L, R : sfixed) return BOOLEAN is
  begin
    if (L'high = R'high and L'low = R'low) then
      return std_match(to_slv(L), to_slv(R));
    else
      report "FIXED_GENERIC_PKG.STD_MATCH: L'RANGE /= R'RANGE, returning FALSE"
        severity warning;
      return false;
    end if;
  end function std_match;
  --%%% end remove

  -- compare functions
  function "=" (
    l, r : ufixed)                      -- fixed point input
    return BOOLEAN is
    constant left_index       : INTEGER := maximum(l'high, r'high);
    constant right_index      : INTEGER := mins(l'low, r'low);
    variable lresize, rresize : ufixed (left_index downto right_index);
    variable lslv, rslv       : UNSIGNED (lresize'length-1 downto 0);
  begin
    if (l'length < 1 or r'length < 1) then
      assert NO_WARNING
        report "FIXED_GENERIC_PKG.""="": null argument detected, returning FALSE"
        severity warning;
      return false;
    elsif (Is_X(l) or Is_X(r)) then
      assert NO_WARNING
        report "FIXED_GENERIC_PKG.""="": metavalue detected, returning FALSE"
        severity warning;
      return false;
    end if;
    lresize := resize (l, left_index, right_index);
    rresize := resize (r, left_index, right_index);
    lslv    := to_uns (lresize);
    rslv    := to_uns (rresize);
    return lslv = rslv;
  end function "=";

  function "=" (
    l, r : sfixed)                      -- fixed point input
    return BOOLEAN is
    constant left_index       : INTEGER := maximum(l'high, r'high);
    constant right_index      : INTEGER := mins(l'low, r'low);
    variable lresize, rresize : sfixed (left_index downto right_index);
    variable lslv, rslv       : SIGNED (lresize'length-1 downto 0);
  begin
    if (l'length < 1 or r'length < 1) then
      assert NO_WARNING
        report "FIXED_GENERIC_PKG.""="": null argument detected, returning FALSE"
        severity warning;
      return false;
    elsif (Is_X(l) or Is_X(r)) then
      assert NO_WARNING
        report "FIXED_GENERIC_PKG.""="": metavalue detected, returning FALSE"
        severity warning;
      return false;
    end if;
    lresize := resize (l, left_index, right_index);
    rresize := resize (r, left_index, right_index);
    lslv    := to_s (lresize);
    rslv    := to_s (rresize);
    return lslv = rslv;
  end function "=";

  function "/=" (
    l, r : ufixed)                      -- fixed point input
    return BOOLEAN is
    constant left_index       : INTEGER := maximum(l'high, r'high);
    constant right_index      : INTEGER := mins(l'low, r'low);
    variable lresize, rresize : ufixed (left_index downto right_index);
    variable lslv, rslv       : UNSIGNED (lresize'length-1 downto 0);
  begin
    if (l'length < 1 or r'length < 1) then
      assert NO_WARNING
        report "FIXED_GENERIC_PKG.""/="": null argument detected, returning TRUE"
        severity warning;
      return true;
    elsif (Is_X(l) or Is_X(r)) then
      assert NO_WARNING
        report "FIXED_GENERIC_PKG.""/="": metavalue detected, returning TRUE"
        severity warning;
      return true;
    end if;
    lresize := resize (l, left_index, right_index);
    rresize := resize (r, left_index, right_index);
    lslv    := to_uns (lresize);
    rslv    := to_uns (rresize);
    return lslv /= rslv;
  end function "/=";

  function "/=" (
    l, r : sfixed)                      -- fixed point input
    return BOOLEAN is
    constant left_index       : INTEGER := maximum(l'high, r'high);
    constant right_index      : INTEGER := mins(l'low, r'low);
    variable lresize, rresize : sfixed (left_index downto right_index);
    variable lslv, rslv       : SIGNED (lresize'length-1 downto 0);
  begin
    if (l'length < 1 or r'length < 1) then
      assert NO_WARNING
        report "FIXED_GENERIC_PKG.""/="": null argument detected, returning TRUE"
        severity warning;
      return true;
    elsif (Is_X(l) or Is_X(r)) then
      assert NO_WARNING
        report "FIXED_GENERIC_PKG.""/="": metavalue detected, returning TRUE"
        severity warning;
      return true;
    end if;
    lresize := resize (l, left_index, right_index);
    rresize := resize (r, left_index, right_index);
    lslv    := to_s (lresize);
    rslv    := to_s (rresize);
    return lslv /= rslv;
  end function "/=";

  function ">" (
    l, r : ufixed)                      -- fixed point input
    return BOOLEAN is
    constant left_index       : INTEGER := maximum(l'high, r'high);
    constant right_index      : INTEGER := mins(l'low, r'low);
    variable lresize, rresize : ufixed (left_index downto right_index);
    variable lslv, rslv       : UNSIGNED (lresize'length-1 downto 0);
  begin
    if (l'length < 1 or r'length < 1) then
      assert NO_WARNING
        report "FIXED_GENERIC_PKG."">"": null argument detected, returning FALSE"
        severity warning;
      return false;
    elsif (Is_X(l) or Is_X(r)) then
      assert NO_WARNING
        report "FIXED_GENERIC_PKG."">"": metavalue detected, returning FALSE"
        severity warning;
      return false;
    end if;
    lresize := resize (l, left_index, right_index);
    rresize := resize (r, left_index, right_index);
    lslv    := to_uns (lresize);
    rslv    := to_uns (rresize);
    return lslv > rslv;
  end function ">";

  function ">" (
    l, r : sfixed)                      -- fixed point input
    return BOOLEAN is
    constant left_index       : INTEGER := maximum(l'high, r'high);
    constant right_index      : INTEGER := mins(l'low, r'low);
    variable lresize, rresize : sfixed (left_index downto right_index);
    variable lslv, rslv       : SIGNED (lresize'length-1 downto 0);
  begin
    if (l'length < 1 or r'length < 1) then
      assert NO_WARNING
        report "FIXED_GENERIC_PKG."">"": null argument detected, returning FALSE"
        severity warning;
      return false;
    elsif (Is_X(l) or Is_X(r)) then
      assert NO_WARNING
        report "FIXED_GENERIC_PKG."">"": metavalue detected, returning FALSE"
        severity warning;
      return false;
    end if;
    lresize := resize (l, left_index, right_index);
    rresize := resize (r, left_index, right_index);
    lslv    := to_s (lresize);
    rslv    := to_s (rresize);
    return lslv > rslv;
  end function ">";

  function "<" (
    l, r : ufixed)                      -- fixed point input
    return BOOLEAN is
    constant left_index       : INTEGER := maximum(l'high, r'high);
    constant right_index      : INTEGER := mins(l'low, r'low);
    variable lresize, rresize : ufixed (left_index downto right_index);
    variable lslv, rslv       : UNSIGNED (lresize'length-1 downto 0);
  begin
    if (l'length < 1 or r'length < 1) then
      assert NO_WARNING
        report "FIXED_GENERIC_PKG.""<"": null argument detected, returning FALSE"
        severity warning;
      return false;
    elsif (Is_X(l) or Is_X(r)) then
      assert NO_WARNING
        report "FIXED_GENERIC_PKG.""<"": metavalue detected, returning FALSE"
        severity warning;
      return false;
    end if;
    lresize := resize (l, left_index, right_index);
    rresize := resize (r, left_index, right_index);
    lslv    := to_uns (lresize);
    rslv    := to_uns (rresize);
    return lslv < rslv;
  end function "<";

  function "<" (
    l, r : sfixed)                      -- fixed point input
    return BOOLEAN is
    constant left_index       : INTEGER := maximum(l'high, r'high);
    constant right_index      : INTEGER := mins(l'low, r'low);
    variable lresize, rresize : sfixed (left_index downto right_index);
    variable lslv, rslv       : SIGNED (lresize'length-1 downto 0);
  begin
    if (l'length < 1 or r'length < 1) then
      assert NO_WARNING
        report "FIXED_GENERIC_PKG.""<"": null argument detected, returning FALSE"
        severity warning;
      return false;
    elsif (Is_X(l) or Is_X(r)) then
      assert NO_WARNING
        report "FIXED_GENERIC_PKG.""<"": metavalue detected, returning FALSE"
        severity warning;
      return false;
    end if;
    lresize := resize (l, left_index, right_index);
    rresize := resize (r, left_index, right_index);
    lslv    := to_s (lresize);
    rslv    := to_s (rresize);
    return lslv < rslv;
  end function "<";

  function ">=" (
    l, r : ufixed)                      -- fixed point input
    return BOOLEAN is
    constant left_index       : INTEGER := maximum(l'high, r'high);
    constant right_index      : INTEGER := mins(l'low, r'low);
    variable lresize, rresize : ufixed (left_index downto right_index);
    variable lslv, rslv       : UNSIGNED (lresize'length-1 downto 0);
  begin
    if (l'length < 1 or r'length < 1) then
      assert NO_WARNING
        report "FIXED_GENERIC_PKG."">="": null argument detected, returning FALSE"
        severity warning;
      return false;
    elsif (Is_X(l) or Is_X(r)) then
      assert NO_WARNING
        report "FIXED_GENERIC_PKG."">="": metavalue detected, returning FALSE"
        severity warning;
      return false;
    end if;
    lresize := resize (l, left_index, right_index);
    rresize := resize (r, left_index, right_index);
    lslv    := to_uns (lresize);
    rslv    := to_uns (rresize);
    return lslv >= rslv;
  end function ">=";

  function ">=" (
    l, r : sfixed)                      -- fixed point input
    return BOOLEAN is
    constant left_index       : INTEGER := maximum(l'high, r'high);
    constant right_index      : INTEGER := mins(l'low, r'low);
    variable lresize, rresize : sfixed (left_index downto right_index);
    variable lslv, rslv       : SIGNED (lresize'length-1 downto 0);
  begin
    if (l'length < 1 or r'length < 1) then
      assert NO_WARNING
        report "FIXED_GENERIC_PKG."">="": null argument detected, returning FALSE"
        severity warning;
      return false;
    elsif (Is_X(l) or Is_X(r)) then
      assert NO_WARNING
        report "FIXED_GENERIC_PKG."">="": metavalue detected, returning FALSE"
        severity warning;
      return false;
    end if;
    lresize := resize (l, left_index, right_index);
    rresize := resize (r, left_index, right_index);
    lslv    := to_s (lresize);
    rslv    := to_s (rresize);
    return lslv >= rslv;
  end function ">=";

  function "<=" (
    l, r : ufixed)                      -- fixed point input
    return BOOLEAN is
    constant left_index       : INTEGER := maximum(l'high, r'high);
    constant right_index      : INTEGER := mins(l'low, r'low);
    variable lresize, rresize : ufixed (left_index downto right_index);
    variable lslv, rslv       : UNSIGNED (lresize'length-1 downto 0);
  begin
    if (l'length < 1 or r'length < 1) then
      assert NO_WARNING
        report "FIXED_GENERIC_PKG.""<="": null argument detected, returning FALSE"
        severity warning;
      return false;
    elsif (Is_X(l) or Is_X(r)) then
      assert NO_WARNING
        report "FIXED_GENERIC_PKG.""<="": metavalue detected, returning FALSE"
        severity warning;
      return false;
    end if;
    lresize     := resize (l, left_index, right_index);
    rresize     := resize (r, left_index, right_index);
    lslv        := to_uns (lresize);
    rslv        := to_uns (rresize);
    return lslv <= rslv;
  end function "<=";

  function "<=" (
    l, r : sfixed)                      -- fixed point input
    return BOOLEAN is
    constant left_index       : INTEGER := maximum(l'high, r'high);
    constant right_index      : INTEGER := mins(l'low, r'low);
    variable lresize, rresize : sfixed (left_index downto right_index);
    variable lslv, rslv       : SIGNED (lresize'length-1 downto 0);
  begin
    if (l'length < 1 or r'length < 1) then
      assert NO_WARNING
        report "FIXED_GENERIC_PKG.""<="": null argument detected, returning FALSE"
        severity warning;
      return false;
    elsif (Is_X(l) or Is_X(r)) then
      assert NO_WARNING
        report "FIXED_GENERIC_PKG.""<="": metavalue detected, returning FALSE"
        severity warning;
      return false;
    end if;
    lresize     := resize (l, left_index, right_index);
    rresize     := resize (r, left_index, right_index);
    lslv        := to_s (lresize);
    rslv        := to_s (rresize);
    return lslv <= rslv;
  end function "<=";

  -- overloads of the default maximum and minimum functions
  function maximum (l, r : ufixed) return ufixed is
  begin
    if l > r then return l;
    else return r;
    end if;
  end function maximum;

  function maximum (l, r : sfixed) return sfixed is
  begin
    if l > r then return l;
    else return r;
    end if;
  end function maximum;

  function minimum (l, r : ufixed) return ufixed is
  begin
    if l > r then return r;
    else return l;
    end if;
  end function minimum;

  function minimum (l, r : sfixed) return sfixed is
  begin
    if l > r then return r;
    else return l;
    end if;
  end function minimum;

  function to_ufixed (
    arg                     : NATURAL;  -- integer
    constant left_index     : INTEGER;  -- size of integer portion
    constant right_index    : INTEGER := 0;                  -- size of fraction
    constant overflow_style : BOOLEAN := fixed_overflow_style;  -- saturate by default
    constant round_style    : BOOLEAN := fixed_round_style)  -- turn on rounding by default
    return ufixed is
    variable argx    : INTEGER;
    constant fw      : INTEGER                       := mine (right_index, right_index);  -- catch literals
    variable result  : ufixed (left_index downto fw) := (others => '0');
    variable sresult : UNSIGNED (left_index downto 0);       -- integer portion
    variable bound   : NATURAL;         -- find the numerical bounds
  begin
    if (left_index < fw) then
      return NAUF;
    end if;
    if left_index >= 0 then
      if (left_index < 30) then
        bound := 2**(left_index+1);
      else
        bound := INTEGER'high;
      end if;
    end if;
    if (arg /= 0) then
      if arg >= bound or left_index < 0 then
        assert NO_WARNING
          report "FIXED_GENERIC_PKG.TO_UFIXED(NATURAL): vector truncated"
          severity warning;
        if (overflow_style = fixed_wrap) then                -- wrap
          if bound = 0 then
            argx := 0;
          else
            argx := arg mod bound;
          end if;
        else                            -- saturate
          return saturate (result'high, result'low);
        end if;
      else
        argx := arg;
      end if;
    else
      return result;                    -- return zero
    end if;
    sresult := to_unsigned (argx, sresult'high+1);
    result := resize (arg            => ufixed (sresult),
                      left_index     => left_index,
                      right_index    => right_index,
                      round_style    => round_style,
                      overflow_style => overflow_style);
    return result;
  end function to_ufixed;

  function to_sfixed (
    arg                     : INTEGER;  -- integer
    constant left_index     : INTEGER;  -- size of integer portion
    constant right_index    : INTEGER := 0;                  -- size of fraction
    constant overflow_style : BOOLEAN := fixed_overflow_style;  -- saturate by default
    constant round_style    : BOOLEAN := fixed_round_style)  -- turn on rounding by default
    return sfixed is
    variable argx    : INTEGER;
    constant fw      : INTEGER                       := mine (right_index, right_index);  -- catch literals
    variable result  : sfixed (left_index downto fw) := (others => '0');
    variable sresult : SIGNED (left_index+1 downto 0);       -- integer portion
    variable bound   : NATURAL                       := 0;
  begin
    if (left_index < fw) then           -- null range
      return NASF;
    end if;
    if left_index >= 0 then
      if (left_index < 30) then
        bound := 2**(left_index);
      else
        bound := INTEGER'high;
      end if;
    end if;
    if (arg /= 0) then
      if (arg >= bound or arg < -bound or left_index < 0) then
        assert NO_WARNING
          report "FIXED_GENERIC_PKG.TO_SFIXED(INTEGER): vector truncated"
          severity warning;
        if overflow_style = fixed_wrap then                  -- wrap
          if bound = 0 then             -- negative integer_range trap
            argx := 0;
          else                          -- shift off the top bits
            argx := arg rem (bound*2);
          end if;
        else                            -- saturate
          if arg < 0 then
            result := not saturate (result'high, result'low);   -- underflow
          else
            result := saturate (result'high, result'low);    -- overflow
          end if;
          return result;
        end if;
      else
        argx := arg;
      end if;
    else
      return result;                    -- return zero
    end if;
    sresult := to_signed (argx, sresult'length);
    result := resize (arg            => sfixed (sresult),
                      left_index     => left_index,
                      right_index    => right_index,
                      round_style    => round_style,
                      overflow_style => overflow_style);
    return result;
  end function to_sfixed;

  function to_ufixed (
    arg                     : REAL;     -- real
    constant left_index     : INTEGER;  -- size of integer portion
    constant right_index    : INTEGER;  -- size of fraction
    constant overflow_style : BOOLEAN := fixed_overflow_style;  -- saturate by default
    constant round_style    : BOOLEAN := fixed_round_style;  -- turn on rounding by default
    constant guard_bits     : NATURAL := fixed_guard_bits)   -- # of guard bits
    return ufixed is
    constant fw              : INTEGER                                  := mine (right_index, right_index);  -- catch literals
    variable result          : ufixed (left_index downto fw)            := (others => '0');
    variable Xresult         : ufixed (left_index downto fw-guard_bits) := (others => '0');
    variable presult         : REAL;
    variable overflow_needed : BOOLEAN;
  begin
    -- If negative or null range, return.
    if (left_index < fw) then
      return NAUF;
    end if;
    if (arg < 0.0) then
      report "FIXED_GENERIC_PKG.TO_UFIXED: Negative argument passed "
        & REAL'image(arg) severity error;
      return result;
    end if;
    presult := arg;
    if presult >= (2.0**(left_index+1)) then
      assert NO_WARNING report "FIXED_GENERIC_PKG.TO_UFIXED(REAL): vector truncated"
        severity warning;
      overflow_needed := (overflow_style = fixed_saturate);
      if overflow_style = fixed_wrap then
        presult := presult mod (2.0**(left_index+1));        -- wrap
      else
        return saturate (result'high, result'low);
      end if;
    end if;
    for i in Xresult'range loop
      if presult >= 2.0**i then
        Xresult(i) := '1';
        presult    := presult - 2.0**i;
      else
        Xresult(i) := '0';
      end if;
    end loop;
    if guard_bits > 0 and round_style = fixed_round then
      result := round_fixed (arg => Xresult (left_index
                                             downto right_index),
                             remainder => Xresult (right_index-1 downto
                                                   right_index-guard_bits),
                             overflow_style => overflow_style);
    else
      result := Xresult (result'range);
    end if;
    return result;
  end function to_ufixed;

  function to_sfixed (
    arg                     : REAL;     -- real
    constant left_index     : INTEGER;  -- size of integer portion
    constant right_index    : INTEGER;  -- size of fraction
    constant overflow_style : BOOLEAN := fixed_overflow_style;  -- saturate by default
    constant round_style    : BOOLEAN := fixed_round_style;  -- turn on rounding by default
    constant guard_bits     : NATURAL := fixed_guard_bits)   -- # of guard bits
    return sfixed is
    constant fw      : INTEGER                                    := mine (right_index, right_index);  -- catch literals
    variable result  : sfixed (left_index downto fw)              := (others => '0');
    variable Xresult : sfixed (left_index+1 downto fw-guard_bits) := (others => '0');
    variable presult : REAL;
  begin
    if (left_index < fw) then           -- null range
      return NASF;
    end if;
    if (arg >= (2.0**left_index) or arg < -(2.0**left_index)) then
      assert NO_WARNING report "FIXED_GENERIC_PKG.TO_SFIXED(REAL): vector truncated"
        severity warning;
      if overflow_style = fixed_saturate then
        if arg < 0.0 then               -- saturate
          result := not saturate (result'high, result'low);  -- underflow
        else
          result := saturate (result'high, result'low);      -- overflow
        end if;
        return result;
      else
        presult := abs(arg) mod (2.0**(left_index+1));       -- wrap
      end if;
    else
      presult := abs(arg);
    end if;
    for i in Xresult'range loop
      if presult >= 2.0**i then
        Xresult(i) := '1';
        presult    := presult - 2.0**i;
      else
        Xresult(i) := '0';
      end if;
    end loop;
    if arg < 0.0 then
      Xresult := to_fixed(-to_s(Xresult), Xresult'high, Xresult'low);
    end if;
    if guard_bits > 0 and round_style then
      result := round_fixed (arg => Xresult (left_index
                                             downto right_index),
                             remainder => Xresult (right_index-1 downto
                                                   right_index-guard_bits),
                             overflow_style => overflow_style);
    else
      result := Xresult (result'range);
    end if;
    return result;
  end function to_sfixed;

  function to_ufixed (
    arg                     : UNSIGNED;                      -- unsigned
    constant left_index     : INTEGER;  -- size of integer portion
    constant right_index    : INTEGER := 0;                  -- size of fraction
    constant overflow_style : BOOLEAN := fixed_overflow_style;  -- saturate by default
    constant round_style    : BOOLEAN := fixed_round_style)  -- turn on rounding by default
    return ufixed is
    constant ARG_LEFT : INTEGER := ARG'length-1;
    alias XARG        : UNSIGNED(ARG_LEFT downto 0) is ARG;
    constant fw       : INTEGER := mine (right_index, right_index);  -- catch literals
    variable result   : ufixed (left_index downto fw);
  begin
    if arg'length < 1 or (left_index < fw) then
      return NAUF;
    end if;
    result := resize (arg            => ufixed (XARG),
                      left_index     => left_index,
                      right_index    => right_index,
                      round_style    => round_style,
                      overflow_style => overflow_style);
    return result;
  end function to_ufixed;

  -- casted version
  function to_ufixed (
    arg : UNSIGNED)                     -- unsigned
    return ufixed is
    constant ARG_LEFT : INTEGER := ARG'length-1;
    alias XARG        : UNSIGNED(ARG_LEFT downto 0) is ARG;
  begin
    if arg'length < 1 then
      return NAUF;
    end if;
    return ufixed(xarg);
  end function to_ufixed;

  function to_sfixed (
    arg                     : SIGNED;   -- signed
    constant left_index     : INTEGER;  -- size of integer portion
    constant right_index    : INTEGER := 0;                  -- size of fraction
    constant overflow_style : BOOLEAN := fixed_overflow_style;  -- saturate by default
    constant round_style    : BOOLEAN := fixed_round_style)  -- turn on rounding by default
    return sfixed is
    constant ARG_LEFT : INTEGER := ARG'length-1;
    alias XARG        : SIGNED(ARG_LEFT downto 0) is ARG;
    constant fw       : INTEGER := mine (right_index, right_index);  -- catch literals
    variable result   : sfixed (left_index downto fw);
  begin
    if arg'length < 1 or (left_index < fw) then
      return NASF;
    end if;
    result := resize (arg            => sfixed (XARG),
                      left_index     => left_index,
                      right_index    => right_index,
                      round_style    => round_style,
                      overflow_style => overflow_style);
    return result;
  end function to_sfixed;

  -- casted version
  function to_sfixed (
    arg : SIGNED)                       -- signed
    return sfixed is
    constant ARG_LEFT : INTEGER := ARG'length-1;
    alias XARG        : SIGNED(ARG_LEFT downto 0) is ARG;
  begin
    if arg'length < 1 then
      return NASF;
    end if;
    return sfixed(xarg);
  end function to_sfixed;

  function add_sign (arg : ufixed) return sfixed is
    variable result : sfixed (arg'high+1 downto arg'low);
  begin
    if arg'length < 1 then
      return NASF;
    end if;
    result (arg'high downto arg'low) := sfixed(cleanvec(arg));
    result (arg'high+1)              := '0';
    return result;
  end function add_sign;

  -- Because of the farily complicated sizing rules in the fixed point
  -- packages these functions are provided to compute the result ranges
  -- Example:
  -- signal uf1 : ufixed (3 downto -3);
  -- signal uf2 : ufixed (4 downto -2);
  -- signal uf1multuf2 : ufixed (ufixed_high (3, -3, '*', 4, -2) downto
  --                             ufixed_low (3, -3, '*', 4, -2));
  -- uf1multuf2 <= uf1 * uf2;
  -- Valid characters: '+', '-', '*', '/', 'r' or 'R' (rem), 'm' or 'M' (mod),
  -- '1' (reciprocal), 'A', 'a' (abs), 'N', 'n' (-sfixed)
  function ufixed_high (left_index, right_index   : INTEGER;
                        operation                 : CHARACTER := 'X';
                        left_index2, right_index2 : INTEGER   := 0)
    return INTEGER is
  begin
    case operation is
      when '+'| '-' => return maximum (left_index, left_index2) + 1;
      when '*'      => return left_index + left_index2 + 1;
      when '/'      => return left_index - right_index2;
      when '1'      => return -right_index;                    -- reciprocal
      when 'R'|'r'  => return mins (left_index, left_index2);  -- "rem"
      when 'M'|'m'  => return mins (left_index, left_index2);  -- "mod"
      when others   => return left_index;  -- For abs and default
    end case;
  end function ufixed_high;
  
  function ufixed_low (left_index, right_index   : INTEGER;
                       operation                 : CHARACTER := 'X';
                       left_index2, right_index2 : INTEGER   := 0)
    return INTEGER is
  begin
    case operation is
      when '+'| '-' => return mins (right_index, right_index2);
      when '*'      => return right_index + right_index2;
      when '/'      => return right_index - left_index2 - 1;
      when '1'      => return -left_index - 1;                   -- reciprocal
      when 'R'|'r'  => return mins (right_index, right_index2);  -- "rem"
      when 'M'|'m'  => return mins (right_index, right_index2);  -- "mod"
      when others   => return right_index;  -- for abs and default
    end case;
  end function ufixed_low;
  
  function sfixed_high (left_index, right_index   : INTEGER;
                        operation                 : CHARACTER := 'X';
                        left_index2, right_index2 : INTEGER   := 0)
    return INTEGER is
  begin
    case operation is
      when '+'| '-' => return maximum (left_index, left_index2) + 1;
      when '*'      => return left_index + left_index2 + 1;
      when '/'      => return left_index - right_index2 + 1;
      when '1'      => return -right_index + 1;                -- reciprocal
      when 'R'|'r'  => return mins (left_index, left_index2);  -- "rem"
      when 'M'|'m'  => return left_index2;                     -- "mod"
      when 'A'|'a'  => return left_index + 1;                  -- "abs"
      when 'N'|'n'  => return left_index + 1;                  -- -sfixed
      when others   => return left_index;
    end case;
  end function sfixed_high;

  function sfixed_low (left_index, right_index   : INTEGER;
                       operation                 : CHARACTER := 'X';
                       left_index2, right_index2 : INTEGER   := 0)
    return INTEGER is
  begin
    case operation is
      when '+'| '-' => return mins (right_index, right_index2);
      when '*'      => return right_index + right_index2;
      when '/'      => return right_index - left_index2;
      when '1'      => return -left_index;  -- reciprocal
      when 'R'|'r'  => return mins (right_index, right_index2);  -- "rem"
      when 'M'|'m'  => return mins (right_index, right_index2);  -- "mod"
      when others   => return right_index;  -- default for abs, neg and default
    end case;
  end function sfixed_low;
  -- Same as above, but using the "size_res" input only for their ranges:
  -- signal uf1multuf2 : ufixed (ufixed_high (uf1, '*', uf2) downto
  --                             ufixed_low (uf1, '*', uf2));
  -- uf1multuf2 <= uf1 * uf2;  
  function ufixed_high (size_res  : ufixed;
                        operation : CHARACTER := 'X';
                        size_res2 : ufixed)
    return INTEGER is
  begin
    return ufixed_high (left_index   => size_res'high,
                        right_index  => size_res'low,
                        operation    => operation,
                        left_index2  => size_res2'high,
                        right_index2 => size_res2'low);
  end function ufixed_high;
  function ufixed_low (size_res  : ufixed;
                       operation : CHARACTER := 'X';
                       size_res2 : ufixed)
    return INTEGER is
  begin
    return ufixed_low (left_index   => size_res'high,
                       right_index  => size_res'low,
                       operation    => operation,
                       left_index2  => size_res2'high,
                       right_index2 => size_res2'low);
  end function ufixed_low;
  function sfixed_high (size_res  : sfixed;
                        operation : CHARACTER := 'X';
                        size_res2 : sfixed)
    return INTEGER is
  begin
    return sfixed_high (left_index   => size_res'high,
                        right_index  => size_res'low,
                        operation    => operation,
                        left_index2  => size_res2'high,
                        right_index2 => size_res2'low);
  end function sfixed_high;
  function sfixed_low (size_res  : sfixed;
                       operation : CHARACTER := 'X';
                       size_res2 : sfixed)
    return INTEGER is
  begin
    return sfixed_low (left_index   => size_res'high,
                       right_index  => size_res'low,
                       operation    => operation,
                       left_index2  => size_res2'high,
                       right_index2 => size_res2'low);
  end function sfixed_low;

  -- purpose: returns a saturated number
  function saturate (
    constant left_index  : INTEGER;
    constant right_index : INTEGER)
    return ufixed is
    constant sat : ufixed (left_index downto right_index) := (others => '1');
  begin
    return sat;
  end function saturate;

  -- purpose: returns a saturated number
  function saturate (
    constant left_index  : INTEGER;
    constant right_index : INTEGER)
    return sfixed is
    variable sat : sfixed (left_index downto right_index) := (others => '1');
  begin
    -- saturate positive, to saturate negative, just do "not saturate()"
    sat (left_index) := '0';
    return sat;
  end function saturate;

  function saturate (
    size_res : ufixed)                  -- only the size of this is used
    return ufixed is
  begin
    return saturate (size_res'high, size_res'low);
  end function saturate;

  function saturate (
    size_res : sfixed)                  -- only the size of this is used
    return sfixed is
  begin
    return saturate (size_res'high, size_res'low);
  end function saturate;

  -- As a concession to those who use a graphical DSP environment,
  -- these functions take parameters in those tools format and create
  -- fixed point numbers.  These functions are designed to convert from
  -- a std_logic_vector to the VHDL fixed point format using the conventions
  -- of these packages.  In a pure VHDL environment you should use the
  -- "to_ufixed" and "to_sfixed" routines.
  -- Unsigned fixed point
  function to_UFix (
    arg      : STD_LOGIC_VECTOR;
    width    : NATURAL;                 -- width of vector
    fraction : NATURAL)                 -- width of fraction
    return ufixed is
    variable result : ufixed (width-fraction-1 downto -fraction);
  begin
    if (arg'length /= result'length) then
      report "FIXED_GENERIC_PKG.TO_UFIX (STD_LOGIC_VECTOR) "
        & "Vector lengths do not match.  Input length is "
        & INTEGER'image(arg'length) & " and output will be "
        & INTEGER'image(result'length) & " wide."
        severity error;
      return NAUF;
    else
      result := to_ufixed (arg, result'high, result'low);
      return result;
    end if;
  end function to_UFix;

  -- signed fixed point
  function to_SFix (
    arg      : STD_LOGIC_VECTOR;
    width    : NATURAL;                 -- width of vector
    fraction : NATURAL)                 -- width of fraction
    return sfixed is
    variable result : sfixed (width-fraction-1 downto -fraction);
  begin
    if (arg'length /= result'length) then
      report "FIXED_GENERIC_PKG.TO_SFIX (STD_LOGIC_VECTOR) "
        & "Vector lengths do not match.  Input length is "
        & INTEGER'image(arg'length) & " and output will be "
        & INTEGER'image(result'length) & " wide."
        severity error;
      return NASF;
    else
      result := to_sfixed (arg, result'high, result'low);
      return result;
    end if;
  end function to_SFix;

  -- finding the bounds of a number.  These functions can be used like this:
  -- signal xxx : ufixed (7 downto -3);
  -- -- Which is the same as "ufixed (UFix_high (11,3) downto UFix_low(11,3))"
  -- signal yyy : ufixed (UFix_high (11, 3, "+", 11, 3)
  --               downto UFix_low(11, 3, "+", 11, 3));
  -- Where "11" is the width of xxx (xxx'length),
  -- and 3 is the lower bound (abs (xxx'low))
  -- In a pure VHDL environment use "ufixed_high" and "ufixed_low"
  function ufix_high (
    width, fraction   : NATURAL;
    operation         : CHARACTER := 'X';
    width2, fraction2 : NATURAL   := 0)
    return INTEGER is
  begin
    return ufixed_high (left_index    => width - 1 - fraction,
                         right_index  => -fraction,
                         operation    => operation,
                         left_index2  => width2 - 1 - fraction2,
                         right_index2 => -fraction2);
  end function ufix_high;
  function ufix_low (
    width, fraction   : NATURAL;
    operation         : CHARACTER := 'X';
    width2, fraction2 : NATURAL   := 0)
    return INTEGER is
  begin
    return ufixed_low (left_index    => width - 1 - fraction,
                        right_index  => -fraction,
                        operation    => operation,
                        left_index2  => width2 - 1 - fraction2,
                        right_index2 => -fraction2);
  end function ufix_low;
  function sfix_high (
    width, fraction   : NATURAL;
    operation         : CHARACTER := 'X';
    width2, fraction2 : NATURAL   := 0)
    return INTEGER is
  begin
    return sfixed_high (left_index    => width - fraction,
                         right_index  => -fraction,
                         operation    => operation,
                         left_index2  => width2 - fraction2,
                         right_index2 => -fraction2);
  end function sfix_high;
  function sfix_low (
    width, fraction   : NATURAL;
    operation         : CHARACTER := 'X';
    width2, fraction2 : NATURAL   := 0)
    return INTEGER is
  begin
    return sfixed_low (left_index    => width - fraction,
                        right_index  => -fraction,
                        operation    => operation,
                        left_index2  => width2 - fraction2,
                        right_index2 => -fraction2);
  end function sfix_low;

  function to_unsigned (
    arg                     : ufixed;   -- ufixed point input
    constant size           : NATURAL;  -- length of output
    constant overflow_style : BOOLEAN := fixed_overflow_style;  -- saturate by default
    constant round_style    : BOOLEAN := fixed_round_style)  -- rounding by default
    return UNSIGNED is
  begin
    return to_uns(resize (arg            => arg,
                          left_index     => size-1,
                          right_index    => 0,
                          round_style    => round_style,
                          overflow_style => overflow_style));
  end function to_unsigned;

  function to_unsigned (
    arg                     : ufixed;   -- ufixed point input
    size_res                : UNSIGNED;  -- length of output
    constant overflow_style : BOOLEAN := fixed_overflow_style;  -- saturate by default
    constant round_style    : BOOLEAN := fixed_round_style)  -- rounding by default
    return UNSIGNED is
  begin
    return to_unsigned (arg            => arg,
                        size           => size_res'length,
                          round_style    => round_style,
                          overflow_style => overflow_style);
  end function to_unsigned;

  function to_signed (
    arg                     : sfixed;   -- ufixed point input
    constant size           : NATURAL;  -- length of output
    constant overflow_style : BOOLEAN := fixed_overflow_style;  -- saturate by default
    constant round_style    : BOOLEAN := fixed_round_style)  -- rounding by default
    return SIGNED is
  begin
    return to_s(resize (arg            => arg,
                        left_index     => size-1,
                        right_index    => 0,
                        round_style    => round_style,
                        overflow_style => overflow_style));
  end function to_signed;

  function to_signed (
    arg                     : sfixed;   -- ufixed point input
    size_res                : SIGNED;  -- used for length of output
    constant overflow_style : BOOLEAN := fixed_overflow_style;  -- saturate by default
    constant round_style    : BOOLEAN := fixed_round_style)  -- rounding by default
    return SIGNED is
  begin
    return to_signed (arg            => arg,
                      size           => size_res'length,
                      round_style    => round_style,
                      overflow_style => overflow_style);
  end function to_signed;

  function to_real (
    arg : ufixed)                       -- ufixed point input
    return REAL is
    constant left_index  : INTEGER := arg'high;
    constant right_index : INTEGER := arg'low;
    variable result      : REAL;        -- result
    variable arg_int     : ufixed (left_index downto right_index);
  begin
    if (arg'length < 1) then
      return 0.0;
    end if;
    arg_int := cleanvec(arg);
    if (Is_X(arg_int)) then
      assert NO_WARNING
        report "FIXED_GENERIC_PKG.TO_REAL: metavalue detected, returning 0.0"
        severity warning;
      return 0.0;
    end if;
    result := 0.0;
    for i in arg_int'range loop
      if (arg_int(i) = '1') then
        result := result + (2.0**i);
      end if;
    end loop;
    return result;
  end function to_real;

  function to_real (
    arg : sfixed)                       -- ufixed point input
    return REAL is
    constant left_index  : INTEGER := arg'high;
    constant right_index : INTEGER := arg'low;
    variable result      : REAL;        -- result
    variable arg_int     : sfixed (left_index downto right_index);
    -- unsigned version of argument
    variable arg_uns     : ufixed (left_index downto right_index);
    -- absolute of argument
  begin
    if (arg'length < 1) then
      return 0.0;
    end if;
    arg_int := cleanvec(arg);
    if (Is_X(arg_int)) then
      assert NO_WARNING
        report "FIXED_GENERIC_PKG.TO_REAL: metavalue detected, returning 0.0"
        severity warning;
      return 0.0;
    end if;
    arg_uns := abs(arg_int);
    result  := to_real (arg_uns);
    if (arg_int(arg_int'high) = '1') then
      result := -result;
    end if;
    return result;
  end function to_real;

  function to_integer (
    arg                     : ufixed;   -- fixed point input
    constant overflow_style : BOOLEAN := fixed_overflow_style;  -- saturate by default
    constant round_style    : BOOLEAN := fixed_round_style)  -- rounding by default
    return NATURAL is
    constant left_index : INTEGER := arg'high;
    variable arg_uns    : UNSIGNED (minimum(31, left_index+1) downto 0)
 := (others => '0');
  begin
    if (arg'length < 1) then
      return 0;
    end if;
    if (Is_X (arg)) then
      assert NO_WARNING
        report "FIXED_GENERIC_PKG.TO_INTEGER: metavalue detected, returning 0"
        severity warning;
      return 0;
    end if;
    if (left_index < -1) then
      return 0;
    end if;
    arg_uns := to_uns(resize (arg            => arg,
                              left_index     => arg_uns'high,
                              right_index    => 0,
                              round_style    => round_style,
                              overflow_style => overflow_style));
    return to_integer (arg_uns);
  end function to_integer;

  function to_integer (
    arg                     : sfixed;   -- fixed point input
    constant overflow_style : BOOLEAN := fixed_overflow_style;  -- saturate by default
    constant round_style    : BOOLEAN := fixed_round_style)  -- rounding by default
    return INTEGER is
    constant left_index  : INTEGER := arg'high;
    constant right_index : INTEGER := arg'low;
    variable arg_s       : SIGNED (minimum(31, left_index+1) downto 0);
  begin
    if (arg'length < 1) then
      return 0;
    end if;
    if (Is_X (arg)) then
      assert NO_WARNING
        report "FIXED_GENERIC_PKG.TO_INTEGER: metavalue detected, returning 0"
        severity warning;
      return 0;
    end if;
    if (left_index < -1) then
      return 0;
    end if;
    arg_s := to_s(resize (arg            => arg,
                          left_index     => arg_s'high,
                          right_index    => 0,
                          round_style    => round_style,
                          overflow_style => overflow_style));
    return to_integer (arg_s);
  end function to_integer;

  function to_01 (
    s             : ufixed;              -- ufixed point input
    constant XMAP : STD_LOGIC := '0')    -- Map x to
    return ufixed is
    variable result : ufixed (s'range);  -- result
  begin
    for i in s'range loop
      case s(i) is
        when '0' | 'L' => result(i) := '0';
        when '1' | 'H' => result(i) := '1';
        when others    => result(i) := XMAP;
      end case;
    end loop;
    return result;
  end function to_01;

  function to_01 (
    s             : sfixed;             -- ufixed point input
    constant XMAP : STD_LOGIC := '0')   -- Map x to
    return sfixed is
    variable result : sfixed (s'range);
  begin
    for i in s'range loop
      case s(i) is
        when '0' | 'L' => result(i) := '0';
        when '1' | 'H' => result(i) := '1';
        when others    => result(i) := XMAP;
      end case;
    end loop;
    return result;
  end function to_01;

  function Is_X (
    arg : ufixed)
    return BOOLEAN is
    variable argslv : STD_LOGIC_VECTOR (arg'length-1 downto 0);  -- slv
  begin
    argslv := to_slv(arg);
    return Is_X(argslv);
  end function Is_X;
  
  function Is_X (
    arg : sfixed)
    return BOOLEAN is
    variable argslv : STD_LOGIC_VECTOR (arg'length-1 downto 0);  -- slv
  begin
    argslv := to_slv(arg);
    return Is_X(argslv);
  end function Is_X;

  function To_X01 (
    arg : ufixed)
    return ufixed is
  begin
    return to_ufixed (To_X01(to_slv(arg)), arg'high, arg'low);
  end function To_X01;

  function to_X01 (
    arg : sfixed)
    return sfixed is
  begin
    return to_sfixed (To_X01(to_slv(arg)), arg'high, arg'low);
  end function To_X01;

  function To_X01Z (
    arg : ufixed)
    return ufixed is
  begin
    return to_ufixed (To_X01Z(to_slv(arg)), arg'high, arg'low);
  end function To_X01Z;

  function to_X01Z (
    arg : sfixed)
    return sfixed is
  begin
    return to_sfixed (To_X01Z(to_slv(arg)), arg'high, arg'low);
  end function To_X01Z;

  function To_UX01 (
    arg : ufixed)
    return ufixed is
  begin
    return to_ufixed (To_UX01(to_slv(arg)), arg'high, arg'low);
  end function To_UX01;

  function to_UX01 (
    arg : sfixed)
    return sfixed is
  begin
    return to_sfixed (To_UX01(to_slv(arg)), arg'high, arg'low);
  end function To_UX01;


  function resize (
    arg                     : ufixed;   -- input
    constant left_index     : INTEGER;  -- integer portion
    constant right_index    : INTEGER;  -- size of fraction
    constant overflow_style : BOOLEAN := fixed_overflow_style;  -- overflow
    constant round_style    : BOOLEAN := fixed_round_style)     -- rounding
    return ufixed is
    constant arghigh : INTEGER := maximum (arg'high, arg'low);
    constant arglow  : INTEGER := mine (arg'high, arg'low);
    variable invec   : ufixed (arghigh downto arglow);
    variable result  : ufixed(left_index downto right_index) :=
      (others => '0');
    variable needs_rounding : BOOLEAN := false;
  begin                                 -- resize
    if (arg'length < 1) or (result'length < 1) then
      return NAUF;
    elsif (invec'length < 1) then
      return result;                    -- string literal value
    else
      invec := cleanvec(arg);
      if (right_index > arghigh) then   -- return top zeros
        needs_rounding := (round_style = fixed_round) and
                          (right_index = arghigh+1);
      elsif (left_index < arglow) then  -- return overflow
        if (overflow_style = fixed_saturate) and
          (or_reducex(to_slv(invec)) = '1') then
          result := saturate (result'high, result'low);         -- saturate
        end if;
      elsif (arghigh > left_index) then
        -- wrap or saturate?
        if (overflow_style and
            or_reducex(to_slv(invec(arghigh downto left_index+1))) = '1')
        then
          result := saturate (result'high, result'low);         -- saturate
        else
          if (arglow >= right_index) then
            result (left_index downto arglow) :=
              invec(left_index downto arglow);
          else
            result (left_index downto right_index) :=
              invec (left_index downto right_index);
            needs_rounding := (round_style = fixed_round);      -- round
          end if;
        end if;
      else                              -- arghigh <= integer width
        if (arglow >= right_index) then
          result (arghigh downto arglow) := invec;
        else
          result (arghigh downto right_index) :=
            invec (arghigh downto right_index);
          needs_rounding := (round_style = fixed_round);        -- round
        end if;
      end if;
      -- Round result
      if needs_rounding then
        result := round_fixed (arg            => result,
                               remainder      => invec (right_index-1
                                                        downto arglow),
                               overflow_style => overflow_style);
      end if;
      return result;
    end if;
  end function resize;

  function resize (
    arg                     : sfixed;   -- input
    constant left_index     : INTEGER;  -- integer portion
    constant right_index    : INTEGER;  -- size of fraction
    constant overflow_style : BOOLEAN := fixed_overflow_style;  -- overflow
    constant round_style    : BOOLEAN := fixed_round_style)     -- rounding
    return sfixed is
    constant arghigh : INTEGER := maximum (arg'high, arg'low);
    constant arglow  : INTEGER := mine (arg'high, arg'low);
    variable invec   : sfixed (arghigh downto arglow);
    variable result  : sfixed(left_index downto right_index) :=
      (others => '0');
    variable reduced        : STD_ULOGIC;
    variable needs_rounding : BOOLEAN := false;                 -- rounding
  begin                                 -- resize
    if (arg'length < 1) or (result'length < 1) then
      return NASF;
    elsif (invec'length < 1) then
      return result;                    -- string literal value
    else
      invec := cleanvec(arg);
      if (right_index > arghigh) then   -- return top zeros
        if (arg'low /= INTEGER'low) then  -- check for a literal
          result := (others => arg(arghigh));                   -- sign extend
        end if;
        needs_rounding := (round_style = fixed_round) and
                          (right_index = arghigh+1);
      elsif (left_index < arglow) then  -- return overflow
        if (overflow_style) then
          reduced := or_reducex(to_slv(invec));
          if (reduced = '1') then
            if (invec(arghigh) = '0') then
              -- saturate POSITIVE
              result := saturate (result'high, result'low);
            else
              -- saturate negative
              result := not saturate (result'high, result'low);
            end if;
            -- else return 0 (input was 0)
          end if;
          -- else return 0 (wrap)
        end if;
      elsif (arghigh > left_index) then
        if (invec(arghigh) = '0') then
          reduced := or_reducex(to_slv(invec(arghigh-1 downto
                                             left_index)));
          if overflow_style and reduced = '1' then
            -- saturate positive
            result := saturate (result'high, result'low);
          else
            if (right_index > arglow) then
              result         := invec (left_index downto right_index);
              needs_rounding := (round_style = fixed_round);
            else
              result (left_index downto arglow) :=
                invec (left_index downto arglow);
            end if;
          end if;
        else
          reduced := and_reducex(to_slv(invec(arghigh-1 downto
                                              left_index)));
          if overflow_style and reduced = '0' then
            result := not saturate (result'high, result'low);
          else
            if (right_index > arglow) then
              result         := invec (left_index downto right_index);
              needs_rounding := (round_style = fixed_round);
            else
              result (left_index downto arglow) :=
                invec (left_index downto arglow);
            end if;
          end if;
        end if;
      else                              -- arghigh <= integer width
        if (arglow >= right_index) then
          result (arghigh downto arglow) := invec;
        else
          result (arghigh downto right_index) :=
            invec (arghigh downto right_index);
          needs_rounding := (round_style = fixed_round);        -- round
        end if;
        if (left_index > arghigh) then  -- sign extend
          result(left_index downto arghigh+1) := (others => invec(arghigh));
        end if;
      end if;
      -- Round result
      if (needs_rounding) then
        result := round_fixed (arg            => result,
                               remainder      => invec (right_index-1
                                                        downto arglow),
                               overflow_style => overflow_style);
      end if;
      return result;
    end if;
  end function resize;

  -- size_res functions
  -- These functions compute the size from a passed variable named "size_res"
  -- The only part of this variable used it it's size, it is never passed
  -- to a lower level routine.
  function to_ufixed (
    arg      : STD_LOGIC_VECTOR;        -- shifted vector
    size_res : ufixed)                  -- for size only
    return ufixed is
    variable result : ufixed (size_res'left downto size_res'right);
  begin
    if (result'length < 1) then
      return result;
    else
      result := to_ufixed (arg         => arg,
                           left_index  => size_res'high,
                           right_index => size_res'low);
      return result;
    end if;
  end function to_ufixed;

  function to_sfixed (
    arg      : STD_LOGIC_VECTOR;        -- shifted vector
    size_res : sfixed)                  -- for size only
    return sfixed is
    variable result : sfixed (size_res'left downto size_res'right);
  begin
    if (result'length < 1) then
      return result;
    else
      result := to_sfixed (arg         => arg,
                           left_index  => size_res'high,
                           right_index => size_res'low);
      return result;
    end if;
  end function to_sfixed;


  function to_ufixed (
    arg                     : NATURAL;  -- integer
    size_res                : ufixed;   -- for size only
    constant overflow_style : BOOLEAN := fixed_overflow_style;  -- saturate by default
    constant round_style    : BOOLEAN := fixed_round_style)  -- turn on rounding by default
    return ufixed is
    variable result : ufixed (size_res'left downto size_res'right);
  begin
    if (result'length < 1) then
      return result;
    else
      result := to_ufixed (arg            => arg,
                           left_index     => size_res'high,
                           right_index    => size_res'low,
                           round_style    => round_style,
                           overflow_style => overflow_style);
      return result;
    end if;
  end function to_ufixed;

  function to_sfixed (
    arg                     : INTEGER;  -- integer
    size_res                : sfixed;   -- for size only
    constant overflow_style : BOOLEAN := fixed_overflow_style;  -- saturate by default
    constant round_style    : BOOLEAN := fixed_round_style)  -- turn on rounding by default
    return sfixed is
    variable result : sfixed (size_res'left downto size_res'right);
  begin
    if (result'length < 1) then
      return result;
    else
      result := to_sfixed (arg            => arg,
                           left_index     => size_res'high,
                           right_index    => size_res'low,
                           round_style    => round_style,
                           overflow_style => overflow_style);
      return result;
    end if;
  end function to_sfixed;

  function to_ufixed (
    arg                     : REAL;     -- real
    size_res                : ufixed;   -- for size only
    constant overflow_style : BOOLEAN := fixed_overflow_style;  -- saturate by default
    constant round_style    : BOOLEAN := fixed_round_style;  -- turn on rounding by default
    constant guard_bits     : NATURAL := fixed_guard_bits)   -- # of guard bits
    return ufixed is
    variable result : ufixed (size_res'left downto size_res'right);
  begin
    if (result'length < 1) then
      return result;
    else
      result := to_ufixed (arg            => arg,
                           left_index     => size_res'high,
                           right_index    => size_res'low,
                           guard_bits     => guard_bits,
                           round_style    => round_style,
                           overflow_style => overflow_style);
      return result;
    end if;
  end function to_ufixed;

  function to_sfixed (
    arg                     : REAL;     -- real
    size_res                : sfixed;   -- for size only
    constant overflow_style : BOOLEAN := fixed_overflow_style;  -- saturate by default
    constant round_style    : BOOLEAN := fixed_round_style;  -- turn on rounding by default
    constant guard_bits     : NATURAL := fixed_guard_bits)   -- # of guard bits
    return sfixed is
    variable result : sfixed (size_res'left downto size_res'right);
  begin
    if (result'length < 1) then
      return result;
    else
      result := to_sfixed (arg            => arg,
                           left_index     => size_res'high,
                           right_index    => size_res'low,
                           guard_bits     => guard_bits,
                           round_style    => round_style,
                           overflow_style => overflow_style);
      return result;
    end if;
  end function to_sfixed;

  function to_ufixed (
    arg                     : UNSIGNED;                         -- unsigned
    size_res                : ufixed;                           -- for size only
    constant overflow_style : BOOLEAN := fixed_overflow_style;  -- overflow
    constant round_style    : BOOLEAN := fixed_round_style)     -- rounding
    return ufixed is
    variable result : ufixed (size_res'left downto size_res'right);
  begin
    if (result'length < 1) then
      return result;
    else
      result := to_ufixed (arg            => arg,
                           left_index     => size_res'high,
                           right_index    => size_res'low,
                           round_style    => round_style,
                           overflow_style => overflow_style);
      return result;
    end if;
  end function to_ufixed;
  
  function to_sfixed (
    arg                     : SIGNED;   -- signed
    size_res                : sfixed;   -- for size only
    constant overflow_style : BOOLEAN := fixed_overflow_style;  -- saturate by default
    constant round_style    : BOOLEAN := fixed_round_style)  -- turn on rounding by default
    return sfixed is
    variable result : sfixed (size_res'left downto size_res'right);
  begin
    if (result'length < 1) then
      return result;
    else
      result := to_sfixed (arg            => arg,
                           left_index     => size_res'high,
                           right_index    => size_res'low,
                           round_style    => round_style,
                           overflow_style => overflow_style);
      return result;
    end if;
  end function to_sfixed;
  
  function resize (
    arg                     : ufixed;                           -- input
    size_res                : ufixed;                           -- for size only
    constant overflow_style : BOOLEAN := fixed_overflow_style;  -- overflow
    constant round_style    : BOOLEAN := fixed_round_style)     -- rounding
    return ufixed is
    variable result : ufixed (size_res'left downto size_res'right);
  begin
    if (result'length < 1) then
      return result;
    else
      result := resize (arg            => arg,
                        left_index     => size_res'high,
                        right_index    => size_res'low,
                        round_style    => round_style,
                        overflow_style => overflow_style);
      return result;
    end if;
  end function resize;

  function resize (
    arg                     : sfixed;                           -- input
    size_res                : sfixed;                           -- for size only
    constant overflow_style : BOOLEAN := fixed_overflow_style;  -- overflow
    constant round_style    : BOOLEAN := fixed_round_style)     -- rounding
    return sfixed is
    variable result : sfixed (size_res'left downto size_res'right);
  begin
    if (result'length < 1) then
      return result;
    else
      result := resize (arg            => arg,
                        left_index     => size_res'high,
                        right_index    => size_res'low,
                        round_style    => round_style,
                        overflow_style => overflow_style);
      return result;
    end if;
  end function resize;

  -- Overloaded functions
  function "+" (
    l : ufixed;                         -- fixed point input
    r : REAL)
    return ufixed is
  begin
    return (l +
            to_ufixed (arg            => r,
                       left_index     => l'high,
                       right_index    => l'low,
                       overflow_style => fixed_overflow_style,
                       round_style    => fixed_round_style,
                       guard_bits     => fixed_guard_bits));
  end function "+";

  function "+" (
    l : REAL;
    r : ufixed)                         -- fixed point input
    return ufixed is
  begin
    return (to_ufixed (arg            => l,
                       left_index     => r'high,
                       right_index    => r'low,
                       overflow_style => fixed_overflow_style,
                       round_style    => fixed_round_style,
                       guard_bits     => fixed_guard_bits)
            + r);
  end function "+";

  function "+" (
    l : sfixed;                         -- fixed point input
    r : REAL)
    return sfixed is
  begin
    return (l +
            to_sfixed (arg            => r,
                       left_index     => l'high,
                       right_index    => l'low,
                       overflow_style => fixed_overflow_style,
                       round_style    => fixed_round_style,
                       guard_bits     => fixed_guard_bits));
  end function "+";

  function "+" (
    l : REAL;
    r : sfixed)                         -- fixed point input
    return sfixed is
  begin
    return (to_sfixed (arg            => l,
                       left_index     => r'high,
                       right_index    => r'low,
                       overflow_style => fixed_overflow_style,
                       round_style    => fixed_round_style,
                       guard_bits     => fixed_guard_bits)
            + r);
  end function "+";

  -- Overloaded functions
  function "-" (
    l : ufixed;                         -- fixed point input
    r : REAL)
    return ufixed is
  begin
    return (l -
            to_ufixed (arg            => r,
                       left_index     => l'high,
                       right_index    => l'low,
                       overflow_style => fixed_overflow_style,
                       round_style    => fixed_round_style,
                       guard_bits     => fixed_guard_bits));
  end function "-";

  function "-" (
    l : REAL;
    r : ufixed)                         -- fixed point input
    return ufixed is
  begin
    return (to_ufixed (arg            => l,
                       left_index     => r'high,
                       right_index    => r'low,
                       overflow_style => fixed_overflow_style,
                       round_style    => fixed_round_style,
                       guard_bits     => fixed_guard_bits)
            - r);
  end function "-";

  function "-" (
    l : sfixed;                         -- fixed point input
    r : REAL)
    return sfixed is
  begin
    return (l -
            to_sfixed (arg            => r,
                       left_index     => l'high,
                       right_index    => l'low,
                       overflow_style => fixed_overflow_style,
                       round_style    => fixed_round_style,
                       guard_bits     => fixed_guard_bits));
  end function "-";

  function "-" (
    l : REAL;
    r : sfixed)                         -- fixed point input
    return sfixed is
  begin
    return (to_sfixed (arg            => l,
                       left_index     => r'high,
                       right_index    => r'low,
                       overflow_style => fixed_overflow_style,
                       round_style    => fixed_round_style,
                       guard_bits     => fixed_guard_bits)
            - r);
  end function "-";

  -- Overloaded functions
  function "*" (
    l : ufixed;                         -- fixed point input
    r : REAL)
    return ufixed is
  begin
    return (l *
            to_ufixed (arg            => r,
                       left_index     => l'high,
                       right_index    => l'low,
                       overflow_style => fixed_overflow_style,
                       round_style    => fixed_round_style,
                       guard_bits     => fixed_guard_bits));
  end function "*";

  function "*" (
    l : REAL;
    r : ufixed)                         -- fixed point input
    return ufixed is
  begin
    return (to_ufixed (arg            => l,
                       left_index     => r'high,
                       right_index    => r'low,
                       overflow_style => fixed_overflow_style,
                       round_style    => fixed_round_style,
                       guard_bits     => fixed_guard_bits)
            * r);
  end function "*";

  function "*" (
    l : sfixed;                         -- fixed point input
    r : REAL)
    return sfixed is
  begin
    return (l *
            to_sfixed (arg            => r,
                       left_index     => l'high,
                       right_index    => l'low,
                       overflow_style => fixed_overflow_style,
                       round_style    => fixed_round_style,
                       guard_bits     => fixed_guard_bits));
  end function "*";

  function "*" (
    l : REAL;
    r : sfixed)                         -- fixed point input
    return sfixed is
  begin
    return (to_sfixed (arg            => l,
                       left_index     => r'high,
                       right_index    => r'low,
                       overflow_style => fixed_overflow_style,
                       round_style    => fixed_round_style,
                       guard_bits     => fixed_guard_bits)
            * r);
  end function "*";

  -- Overloaded functions
  function "/" (
    l : ufixed;                         -- fixed point input
    r : REAL)
    return ufixed is
  begin
    return (l /
            to_ufixed (arg            => r,
                       left_index     => l'high,
                       right_index    => l'low,
                       overflow_style => fixed_overflow_style,
                       round_style    => fixed_round_style,
                       guard_bits     => fixed_guard_bits));
  end function "/";

  function "/" (
    l : REAL;
    r : ufixed)                         -- fixed point input
    return ufixed is
  begin
    return (to_ufixed (arg            => l,
                       left_index     => r'high,
                       right_index    => r'low,
                       overflow_style => fixed_overflow_style,
                       round_style    => fixed_round_style,
                       guard_bits     => fixed_guard_bits)
            / r);
  end function "/";

  function "/" (
    l : sfixed;                         -- fixed point input
    r : REAL)
    return sfixed is
  begin
    return (l /
            to_sfixed (arg            => r,
                       left_index     => l'high,
                       right_index    => l'low,
                       overflow_style => fixed_overflow_style,
                       round_style    => fixed_round_style,
                       guard_bits     => fixed_guard_bits));
  end function "/";

  function "/" (
    l : REAL;
    r : sfixed)                         -- fixed point input
    return sfixed is
  begin
    return (to_sfixed (arg            => l,
                       left_index     => r'high,
                       right_index    => r'low,
                       overflow_style => fixed_overflow_style,
                       round_style    => fixed_round_style,
                       guard_bits     => fixed_guard_bits)
            / r);
  end function "/";

  -- Overloaded functions
  function "rem" (
    l : ufixed;                         -- fixed point input
    r : REAL)
    return ufixed is
  begin
    return (l rem
            to_ufixed (arg            => r,
                       left_index     => l'high,
                       right_index    => l'low,
                       overflow_style => fixed_overflow_style,
                       round_style    => fixed_round_style,
                       guard_bits     => fixed_guard_bits));
  end function "rem";

  function "rem" (
    l : REAL;
    r : ufixed)                         -- fixed point input
    return ufixed is
  begin
    return (to_ufixed (arg            => l,
                       left_index     => r'high,
                       right_index    => r'low,
                       overflow_style => fixed_overflow_style,
                       round_style    => fixed_round_style,
                       guard_bits     => fixed_guard_bits)
            rem r);
  end function "rem";

  function "rem" (
    l : sfixed;                         -- fixed point input
    r : REAL)
    return sfixed is
  begin
    return (l rem
            to_sfixed (arg            => r,
                       left_index     => l'high,
                       right_index    => l'low,
                       overflow_style => fixed_overflow_style,
                       round_style    => fixed_round_style,
                       guard_bits     => fixed_guard_bits));
  end function "rem";

  function "rem" (
    l : REAL;
    r : sfixed)                         -- fixed point input
    return sfixed is
  begin
    return (to_sfixed (arg            => l,
                       left_index     => r'high,
                       right_index    => r'low,
                       overflow_style => fixed_overflow_style,
                       round_style    => fixed_round_style,
                       guard_bits     => fixed_guard_bits)
            rem r);
  end function "rem";

  function "mod" (
    l : ufixed;                         -- fixed point input
    r : REAL)
    return ufixed is
  begin
    return (l mod
            to_ufixed (arg            => r,
                       left_index     => l'high,
                       right_index    => l'low,
                       overflow_style => fixed_overflow_style,
                       round_style    => fixed_round_style,
                       guard_bits     => fixed_guard_bits));
  end function "mod";

  function "mod" (
    l : REAL;
    r : ufixed)                         -- fixed point input
    return ufixed is
  begin
    return (to_ufixed (arg            => l,
                       left_index     => r'high,
                       right_index    => r'low,
                       overflow_style => fixed_overflow_style,
                       round_style    => fixed_round_style,
                       guard_bits     => fixed_guard_bits)
            mod r);
  end function "mod";

  function "mod" (
    l : sfixed;                         -- fixed point input
    r : REAL)
    return sfixed is
  begin
    return (l mod
            to_sfixed (arg            => r,
                       left_index     => l'high,
                       right_index    => l'low,
                       overflow_style => fixed_overflow_style,
                       round_style    => fixed_round_style,
                       guard_bits     => fixed_guard_bits));
  end function "mod";

  function "mod" (
    l : REAL;
    r : sfixed)                         -- fixed point input
    return sfixed is
  begin
    return (to_sfixed (arg            => l,
                       left_index     => r'high,
                       right_index    => r'low,
                       overflow_style => fixed_overflow_style,
                       round_style    => fixed_round_style,
                       guard_bits     => fixed_guard_bits)
            mod r);
  end function "mod";

  -- Overloaded functions for integers
  function "+" (
    l : ufixed;                         -- fixed point input
    r : NATURAL)
    return ufixed is
  begin
    return (l + to_ufixed (arg            => r,
                           left_index     => l'high,
                           right_index    => l'low,
                           overflow_style => fixed_overflow_style,
                           round_style    => fixed_round_style));  -- rounding not needed
  end function "+";

  function "+" (
    l : NATURAL;
    r : ufixed)                         -- fixed point input
    return ufixed is
  begin
    return (to_ufixed (arg            => l,
                       left_index     => r'high,
                       right_index    => r'low,
                       overflow_style => fixed_overflow_style,
                       round_style    => fixed_round_style)
            + r);
  end function "+";

  function "+" (
    l : sfixed;                         -- fixed point input
    r : INTEGER)
    return sfixed is
  begin
    return (l + to_sfixed (arg            => r,
                           left_index     => l'high,
                           right_index    => l'low,
                           overflow_style => fixed_overflow_style,
                           round_style    => fixed_round_style));
  end function "+";

  function "+" (
    l : INTEGER;
    r : sfixed)                         -- fixed point input
    return sfixed is
  begin
    return (to_sfixed (arg            => l,
                       left_index     => r'high,
                       right_index    => r'low,
                       overflow_style => fixed_overflow_style,
                       round_style    => fixed_round_style)
            + r);
  end function "+";

  -- Overloaded functions
  function "-" (
    l : ufixed;                         -- fixed point input
    r : NATURAL)
    return ufixed is
  begin
    return (l - to_ufixed (arg            => r,
                           left_index     => l'high,
                           right_index    => l'low,
                           overflow_style => fixed_overflow_style,
                           round_style    => fixed_round_style));
  end function "-";

  function "-" (
    l : NATURAL;
    r : ufixed)                         -- fixed point input
    return ufixed is
  begin
    return (to_ufixed (arg            => l,
                       left_index     => r'high,
                       right_index    => r'low,
                       overflow_style => fixed_overflow_style,
                       round_style    => fixed_round_style)
            - r);
  end function "-";

  function "-" (
    l : sfixed;                         -- fixed point input
    r : INTEGER)
    return sfixed is
  begin
    return (l - to_sfixed (arg            => r,
                           left_index     => l'high,
                           right_index    => l'low,
                           overflow_style => fixed_overflow_style,
                           round_style    => fixed_round_style));
  end function "-";

  function "-" (
    l : INTEGER;
    r : sfixed)                         -- fixed point input
    return sfixed is
  begin
    return (to_sfixed (arg            => l,
                       left_index     => r'high,
                       right_index    => r'low,
                       overflow_style => fixed_overflow_style,
                       round_style    => fixed_round_style)
            - r);
  end function "-";

  -- Overloaded functions
  function "*" (
    l : ufixed;                         -- fixed point input
    r : NATURAL)
    return ufixed is
  begin
    return (l * to_ufixed (arg            => r,
                           left_index     => l'high,
                           right_index    => l'low,
                           overflow_style => fixed_overflow_style,
                           round_style    => fixed_round_style));
  end function "*";

  function "*" (
    l : NATURAL;
    r : ufixed)                         -- fixed point input
    return ufixed is
  begin
    return (to_ufixed (arg            => l,
                       left_index     => r'high,
                       right_index    => r'low,
                       overflow_style => fixed_overflow_style,
                       round_style    => fixed_round_style)
            * r);
  end function "*";

  function "*" (
    l : sfixed;                         -- fixed point input
    r : INTEGER)
    return sfixed is
  begin
    return (l * to_sfixed (arg            => r,
                           left_index     => l'high,
                           right_index    => l'low,
                           overflow_style => fixed_overflow_style,
                           round_style    => fixed_round_style));
  end function "*";

  function "*" (
    l : INTEGER;
    r : sfixed)                         -- fixed point input
    return sfixed is
  begin
    return (to_sfixed (arg            => l,
                       left_index     => r'high,
                       right_index    => r'low,
                       overflow_style => fixed_overflow_style,
                       round_style    => fixed_round_style)
            * r);
  end function "*";

  -- Overloaded functions
  function "/" (
    l : ufixed;                         -- fixed point input
    r : NATURAL)
    return ufixed is
  begin
    return (l / to_ufixed (arg            => r,
                           left_index     => l'high,
                           right_index    => l'low,
                           overflow_style => fixed_overflow_style,
                           round_style    => fixed_round_style));
  end function "/";

  function "/" (
    l : NATURAL;
    r : ufixed)                         -- fixed point input
    return ufixed is
  begin
    return (to_ufixed (arg            => l,
                       left_index     => r'high,
                       right_index    => r'low,
                       overflow_style => fixed_overflow_style,
                       round_style    => fixed_round_style)
            / r);
  end function "/";

  function "/" (
    l : sfixed;                         -- fixed point input
    r : INTEGER)
    return sfixed is
  begin
    return (l / to_sfixed (arg            => r,
                           left_index     => l'high,
                           right_index    => l'low,
                           overflow_style => fixed_overflow_style,
                           round_style    => fixed_round_style));
  end function "/";

  function "/" (
    l : INTEGER;
    r : sfixed)                         -- fixed point input
    return sfixed is
  begin
    return (to_sfixed (arg            => l,
                       left_index     => r'high,
                       right_index    => r'low,
                       overflow_style => fixed_overflow_style,
                       round_style    => fixed_round_style)
            / r);
  end function "/";

  -- Overloaded functions
  function "rem" (
    l : ufixed;                         -- fixed point input
    r : NATURAL)
    return ufixed is
  begin
    return (l rem to_ufixed (arg            => r,
                             left_index     => l'high,
                             right_index    => l'low,
                             overflow_style => fixed_overflow_style,
                             round_style    => fixed_round_style));
  end function "rem";

  function "rem" (
    l : NATURAL;
    r : ufixed)                         -- fixed point input
    return ufixed is
  begin
    return (to_ufixed (arg            => l,
                       left_index     => r'high,
                       right_index    => r'low,
                       overflow_style => fixed_overflow_style,
                       round_style    => fixed_round_style)
            rem r);
  end function "rem";

  function "rem" (
    l : sfixed;                         -- fixed point input
    r : INTEGER)
    return sfixed is
  begin
    return (l rem to_sfixed (arg            => r,
                             left_index     => l'high,
                             right_index    => l'low,
                             overflow_style => fixed_overflow_style,
                             round_style    => fixed_round_style));
  end function "rem";

  function "rem" (
    l : INTEGER;
    r : sfixed)                         -- fixed point input
    return sfixed is
  begin
    return (to_sfixed (arg            => l,
                       left_index     => r'high,
                       right_index    => r'low,
                       overflow_style => fixed_overflow_style,
                       round_style    => fixed_round_style)
            rem r);
  end function "rem";

  function "mod" (
    l : ufixed;                         -- fixed point input
    r : NATURAL)
    return ufixed is
  begin
    return (l mod to_ufixed (arg            => r,
                             left_index     => l'high,
                             right_index    => l'low,
                             overflow_style => fixed_overflow_style,
                             round_style    => fixed_round_style));
  end function "mod";

  function "mod" (
    l : NATURAL;
    r : ufixed)                         -- fixed point input
    return ufixed is
  begin
    return (to_ufixed (arg            => l,
                       left_index     => r'high,
                       right_index    => r'low,
                       overflow_style => fixed_overflow_style,
                       round_style    => fixed_round_style)
            mod r);
  end function "mod";

  function "mod" (
    l : sfixed;                         -- fixed point input
    r : INTEGER)
    return sfixed is
  begin
    return (l mod to_sfixed (arg            => r,
                             left_index     => l'high,
                             right_index    => l'low,
                             overflow_style => fixed_overflow_style,
                             round_style    => fixed_round_style));
  end function "mod";

  function "mod" (
    l : INTEGER;
    r : sfixed)                         -- fixed point input
    return sfixed is
  begin
    return (to_sfixed (arg            => l,
                       left_index     => r'high,
                       right_index    => r'low,
                       overflow_style => fixed_overflow_style,
                       round_style    => fixed_round_style)
            mod r);
  end function "mod";

  -- overloaded compare functions
  function "=" (
    l : ufixed;
    r : NATURAL)                        -- fixed point input
    return BOOLEAN is
  begin
    return (l = to_ufixed (arg            => r,
                           left_index     => l'high,
                           right_index    => l'low,
                           overflow_style => fixed_overflow_style,
                           round_style    => fixed_round_style));
  end function "=";

  function "/=" (
    l : ufixed;
    r : NATURAL)                        -- fixed point input
    return BOOLEAN is
  begin
    return (l /= to_ufixed (arg            => r,
                            left_index     => l'high,
                            right_index    => l'low,
                            overflow_style => fixed_overflow_style,
                            round_style    => fixed_round_style));
  end function "/=";

  function ">=" (
    l : ufixed;
    r : NATURAL)                        -- fixed point input
    return BOOLEAN is
  begin
    return (l >= to_ufixed (arg            => r,
                            left_index     => l'high,
                            right_index    => l'low,
                            overflow_style => fixed_overflow_style,
                            round_style    => fixed_round_style));
  end function ">=";

  function "<=" (
    l : ufixed;
    r : NATURAL)                        -- fixed point input
    return BOOLEAN is
  begin
    return (l <= to_ufixed (arg            => r,
                            left_index     => l'high,
                            right_index    => l'low,
                            overflow_style => fixed_overflow_style,
                            round_style    => fixed_round_style));
  end function "<=";

  function ">" (
    l : ufixed;
    r : NATURAL)                        -- fixed point input
    return BOOLEAN is
  begin
    return (l > to_ufixed (arg            => r,
                           left_index     => l'high,
                           right_index    => l'low,
                           overflow_style => fixed_overflow_style,
                           round_style    => fixed_round_style));
  end function ">";

  function "<" (
    l : ufixed;
    r : NATURAL)                        -- fixed point input
    return BOOLEAN is
  begin
    return (l < to_ufixed (arg            => r,
                           left_index     => l'high,
                           right_index    => l'low,
                           overflow_style => fixed_overflow_style,
                           round_style    => fixed_round_style));
  end function "<";

  function "=" (
    l : NATURAL;
    r : ufixed)                         -- fixed point input
    return BOOLEAN is
  begin
    return (to_ufixed (arg            => l,
                       left_index     => r'high,
                       right_index    => r'low,
                       overflow_style => fixed_overflow_style,
                       round_style    => fixed_round_style)
             = r);
  end function "=";

  function "/=" (
    l : NATURAL;
    r : ufixed)                         -- fixed point input
    return BOOLEAN is
  begin
    return (to_ufixed (arg            => l,
                       left_index     => r'high,
                       right_index    => r'low,
                       overflow_style => fixed_overflow_style,
                       round_style    => fixed_round_style)
             /= r);
  end function "/=";

  function ">=" (
    l : NATURAL;
    r : ufixed)                         -- fixed point input
    return BOOLEAN is
  begin
    return (to_ufixed (arg            => l,
                       left_index     => r'high,
                       right_index    => r'low,
                       overflow_style => fixed_overflow_style,
                       round_style    => fixed_round_style)
             >= r);
  end function ">=";

  function "<=" (
    l : NATURAL;
    r : ufixed)                         -- fixed point input
    return BOOLEAN is
  begin
    return (to_ufixed (arg            => l,
                       left_index     => r'high,
                       right_index    => r'low,
                       overflow_style => fixed_overflow_style,
                       round_style    => fixed_round_style)
 <= r);
  end function "<=";

  function ">" (
    l : NATURAL;
    r : ufixed)                         -- fixed point input
    return BOOLEAN is
  begin
    return (to_ufixed (arg            => l,
                       left_index     => r'high,
                       right_index    => r'low,
                       overflow_style => fixed_overflow_style,
                       round_style    => fixed_round_style)
             > r);
  end function ">";

  function "<" (
    l : NATURAL;
    r : ufixed)                         -- fixed point input
    return BOOLEAN is
  begin
    return (to_ufixed (arg            => l,
                       left_index     => r'high,
                       right_index    => r'low,
                       overflow_style => fixed_overflow_style,
                       round_style    => fixed_round_style)
             < r);
  end function "<";

  function "=" (
    l : ufixed;
    r : REAL)                           -- fixed point input
    return BOOLEAN is
  begin
    return (l =
            to_ufixed (arg            => r,
                       left_index     => l'high,
                       right_index    => l'low,
                       overflow_style => fixed_overflow_style,
                       round_style    => fixed_round_style,
                       guard_bits     => fixed_guard_bits));
  end function "=";

  function "/=" (
    l : ufixed;
    r : REAL)                           -- fixed point input
    return BOOLEAN is
  begin
    return (l /=
            to_ufixed (arg            => r,
                       left_index     => l'high,
                       right_index    => l'low,
                       overflow_style => fixed_overflow_style,
                       round_style    => fixed_round_style,
                       guard_bits     => fixed_guard_bits));
  end function "/=";

  function ">=" (
    l : ufixed;
    r : REAL)                           -- fixed point input
    return BOOLEAN is
  begin
    return (l >=
            to_ufixed (arg            => r,
                       left_index     => l'high,
                       right_index    => l'low,
                       overflow_style => fixed_overflow_style,
                       round_style    => fixed_round_style,
                       guard_bits     => fixed_guard_bits));
  end function ">=";

  function "<=" (
    l : ufixed;
    r : REAL)                           -- fixed point input
    return BOOLEAN is
  begin
    return (l <=
            to_ufixed (arg            => r,
                       left_index     => l'high,
                       right_index    => l'low,
                       overflow_style => fixed_overflow_style,
                       round_style    => fixed_round_style,
                       guard_bits     => fixed_guard_bits));
  end function "<=";

  function ">" (
    l : ufixed;
    r : REAL)                           -- fixed point input
    return BOOLEAN is
  begin
    return (l >
            to_ufixed (arg            => r,
                       left_index     => l'high,
                       right_index    => l'low,
                       overflow_style => fixed_overflow_style,
                       round_style    => fixed_round_style,
                       guard_bits     => fixed_guard_bits));
  end function ">";

  function "<" (
    l : ufixed;
    r : REAL)                           -- fixed point input
    return BOOLEAN is
  begin
    return (l <
            to_ufixed (arg            => r,
                       left_index     => l'high,
                       right_index    => l'low,
                       overflow_style => fixed_overflow_style,
                       round_style    => fixed_round_style,
                       guard_bits     => fixed_guard_bits));
  end function "<";

  function "=" (
    l : REAL;
    r : ufixed)                         -- fixed point input
    return BOOLEAN is
  begin
    return (to_ufixed (arg            => l,
                       left_index     => r'high,
                       right_index    => r'low,
                       overflow_style => fixed_overflow_style,
                       round_style    => fixed_round_style,
                       guard_bits     => fixed_guard_bits)
             = r);
  end function "=";

  function "/=" (
    l : REAL;
    r : ufixed)                         -- fixed point input
    return BOOLEAN is
  begin
    return (to_ufixed (arg            => l,
                       left_index     => r'high,
                       right_index    => r'low,
                       overflow_style => fixed_overflow_style,
                       round_style    => fixed_round_style,
                       guard_bits     => fixed_guard_bits)
             /= r);
  end function "/=";

  function ">=" (
    l : REAL;
    r : ufixed)                         -- fixed point input
    return BOOLEAN is
  begin
    return (to_ufixed (arg            => l,
                       left_index     => r'high,
                       right_index    => r'low,
                       overflow_style => fixed_overflow_style,
                       round_style    => fixed_round_style,
                       guard_bits     => fixed_guard_bits)
             >= r);
  end function ">=";

  function "<=" (
    l : REAL;
    r : ufixed)                         -- fixed point input
    return BOOLEAN is
  begin
    return (to_ufixed (arg            => l,
                       left_index     => r'high,
                       right_index    => r'low,
                       overflow_style => fixed_overflow_style,
                       round_style    => fixed_round_style,
                       guard_bits     => fixed_guard_bits)
 <= r);
  end function "<=";

  function ">" (
    l : REAL;
    r : ufixed)                         -- fixed point input
    return BOOLEAN is
  begin
    return (to_ufixed (arg            => l,
                       left_index     => r'high,
                       right_index    => r'low,
                       overflow_style => fixed_overflow_style,
                       round_style    => fixed_round_style,
                       guard_bits     => fixed_guard_bits)
             > r);
  end function ">";

  function "<" (
    l : REAL;
    r : ufixed)                         -- fixed point input
    return BOOLEAN is
  begin
    return (to_ufixed (arg            => l,
                       left_index     => r'high,
                       right_index    => r'low,
                       overflow_style => fixed_overflow_style,
                       round_style    => fixed_round_style,
                       guard_bits     => fixed_guard_bits)
             < r);
  end function "<";

  function "=" (
    l : sfixed;
    r : INTEGER)                        -- fixed point input
    return BOOLEAN is
  begin
    return (l = to_sfixed (arg            => r,
                           left_index     => l'high,
                           right_index    => l'low,
                           overflow_style => fixed_overflow_style,
                           round_style    => fixed_round_style));
  end function "=";

  function "/=" (
    l : sfixed;
    r : INTEGER)                        -- fixed point input
    return BOOLEAN is
  begin
    return (l /= to_sfixed (arg            => r,
                            left_index     => l'high,
                            right_index    => l'low,
                            overflow_style => fixed_overflow_style,
                            round_style    => fixed_round_style));
  end function "/=";

  function ">=" (
    l : sfixed;
    r : INTEGER)                        -- fixed point input
    return BOOLEAN is
  begin
    return (l >= to_sfixed (arg            => r,
                            left_index     => l'high,
                            right_index    => l'low,
                            overflow_style => fixed_overflow_style,
                            round_style    => fixed_round_style));
  end function ">=";

  function "<=" (
    l : sfixed;
    r : INTEGER)                        -- fixed point input
    return BOOLEAN is
  begin
    return (l <= to_sfixed (arg            => r,
                            left_index     => l'high,
                            right_index    => l'low,
                            overflow_style => fixed_overflow_style,
                            round_style    => fixed_round_style));
  end function "<=";

  function ">" (
    l : sfixed;
    r : INTEGER)                        -- fixed point input
    return BOOLEAN is
  begin
    return (l > to_sfixed (arg            => r,
                           left_index     => l'high,
                           right_index    => l'low,
                           overflow_style => fixed_overflow_style,
                           round_style    => fixed_round_style));
  end function ">";

  function "<" (
    l : sfixed;
    r : INTEGER)                        -- fixed point input
    return BOOLEAN is
  begin
    return (l < to_sfixed (arg            => r,
                           left_index     => l'high,
                           right_index    => l'low,
                           overflow_style => fixed_overflow_style,
                           round_style    => fixed_round_style));
  end function "<";

  function "=" (
    l : INTEGER;
    r : sfixed)                         -- fixed point input
    return BOOLEAN is
  begin
    return (to_sfixed (arg            => l,
                       left_index     => r'high,
                       right_index    => r'low,
                       overflow_style => fixed_overflow_style,
                       round_style    => fixed_round_style)
             = r);
  end function "=";

  function "/=" (
    l : INTEGER;
    r : sfixed)                         -- fixed point input
    return BOOLEAN is
  begin
    return (to_sfixed (arg            => l,
                       left_index     => r'high,
                       right_index    => r'low,
                       overflow_style => fixed_overflow_style,
                       round_style    => fixed_round_style)
             /= r);
  end function "/=";

  function ">=" (
    l : INTEGER;
    r : sfixed)                         -- fixed point input
    return BOOLEAN is
  begin
    return (to_sfixed (arg            => l,
                       left_index     => r'high,
                       right_index    => r'low,
                       overflow_style => fixed_overflow_style,
                       round_style    => fixed_round_style)
             >= r);
  end function ">=";

  function "<=" (
    l : INTEGER;
    r : sfixed)                         -- fixed point input
    return BOOLEAN is
  begin
    return (to_sfixed (arg            => l,
                       left_index     => r'high,
                       right_index    => r'low,
                       overflow_style => fixed_overflow_style,
                       round_style    => fixed_round_style)
 <= r);
  end function "<=";

  function ">" (
    l : INTEGER;
    r : sfixed)                         -- fixed point input
    return BOOLEAN is
  begin
    return (to_sfixed (arg            => l,
                       left_index     => r'high,
                       right_index    => r'low,
                       overflow_style => fixed_overflow_style,
                       round_style    => fixed_round_style)
             > r);
  end function ">";

  function "<" (
    l : INTEGER;
    r : sfixed)                         -- fixed point input
    return BOOLEAN is
  begin
    return (to_sfixed (arg            => l,
                       left_index     => r'high,
                       right_index    => r'low,
                       overflow_style => fixed_overflow_style,
                       round_style    => fixed_round_style)
             < r);
  end function "<";

  function "=" (
    l : sfixed;
    r : REAL)                           -- fixed point input
    return BOOLEAN is
  begin
    return (l =
            to_sfixed (arg            => r,
                       left_index     => l'high,
                       right_index    => l'low,
                       overflow_style => fixed_overflow_style,
                       round_style    => fixed_round_style,
                       guard_bits     => fixed_guard_bits));
  end function "=";

  function "/=" (
    l : sfixed;
    r : REAL)                           -- fixed point input
    return BOOLEAN is
  begin
    return (l /=
            to_sfixed (arg            => r,
                       left_index     => l'high,
                       right_index    => l'low,
                       overflow_style => fixed_overflow_style,
                       round_style    => fixed_round_style,
                       guard_bits     => fixed_guard_bits));
  end function "/=";

  function ">=" (
    l : sfixed;
    r : REAL)                           -- fixed point input
    return BOOLEAN is
  begin
    return (l >=
            to_sfixed (arg            => r,
                       left_index     => l'high,
                       right_index    => l'low,
                       overflow_style => fixed_overflow_style,
                       round_style    => fixed_round_style,
                       guard_bits     => fixed_guard_bits));
  end function ">=";

  function "<=" (
    l : sfixed;
    r : REAL)                           -- fixed point input
    return BOOLEAN is
  begin
    return (l <=
            to_sfixed (arg            => r,
                       left_index     => l'high,
                       right_index    => l'low,
                       overflow_style => fixed_overflow_style,
                       round_style    => fixed_round_style,
                       guard_bits     => fixed_guard_bits));
  end function "<=";

  function ">" (
    l : sfixed;
    r : REAL)                           -- fixed point input
    return BOOLEAN is
  begin
    return (l >
            to_sfixed (arg            => r,
                       left_index     => l'high,
                       right_index    => l'low,
                       overflow_style => fixed_overflow_style,
                       round_style    => fixed_round_style,
                       guard_bits     => fixed_guard_bits));
  end function ">";

  function "<" (
    l : sfixed;
    r : REAL)                           -- fixed point input
    return BOOLEAN is
  begin
    return (l <
            to_sfixed (arg            => r,
                       left_index     => l'high,
                       right_index    => l'low,
                       overflow_style => fixed_overflow_style,
                       round_style    => fixed_round_style,
                       guard_bits     => fixed_guard_bits));
  end function "<";

  function "=" (
    l : REAL;
    r : sfixed)                         -- fixed point input
    return BOOLEAN is
  begin
    return (to_sfixed (arg            => l,
                       left_index     => r'high,
                       right_index    => r'low,
                       overflow_style => fixed_overflow_style,
                       round_style    => fixed_round_style,
                       guard_bits     => fixed_guard_bits)
             = r);
  end function "=";

  function "/=" (
    l : REAL;
    r : sfixed)                         -- fixed point input
    return BOOLEAN is
  begin
    return (to_sfixed (arg            => l,
                       left_index     => r'high,
                       right_index    => r'low,
                       overflow_style => fixed_overflow_style,
                       round_style    => fixed_round_style,
                       guard_bits     => fixed_guard_bits)
             /= r);
  end function "/=";

  function ">=" (
    l : REAL;
    r : sfixed)                         -- fixed point input
    return BOOLEAN is
  begin
    return (to_sfixed (arg            => l,
                       left_index     => r'high,
                       right_index    => r'low,
                       overflow_style => fixed_overflow_style,
                       round_style    => fixed_round_style,
                       guard_bits     => fixed_guard_bits)
             >= r);
  end function ">=";

  function "<=" (
    l : REAL;
    r : sfixed)                         -- fixed point input
    return BOOLEAN is
  begin
    return (to_sfixed (arg            => l,
                       left_index     => r'high,
                       right_index    => r'low,
                       overflow_style => fixed_overflow_style,
                       round_style    => fixed_round_style,
                       guard_bits     => fixed_guard_bits)
 <= r);
  end function "<=";

  function ">" (
    l : REAL;
    r : sfixed)                         -- fixed point input
    return BOOLEAN is
  begin
    return (to_sfixed (arg            => l,
                       left_index     => r'high,
                       right_index    => r'low,
                       overflow_style => fixed_overflow_style,
                       round_style    => fixed_round_style,
                       guard_bits     => fixed_guard_bits)
             > r);
  end function ">";

  function "<" (
    l : REAL;
    r : sfixed)                         -- fixed point input
    return BOOLEAN is
  begin
    return (to_sfixed (arg            => l,
                       left_index     => r'high,
                       right_index    => r'low,
                       overflow_style => fixed_overflow_style,
                       round_style    => fixed_round_style,
                       guard_bits     => fixed_guard_bits)
             < r);
  end function "<";

  -- rtl_synthesis off
  -- synthesis translate_off
  -- copied from std_logic_textio
  type MVL9plus is ('U', 'X', '0', '1', 'Z', 'W', 'L', 'H', '-', error);
  type char_indexed_by_MVL9 is array (STD_ULOGIC) of CHARACTER;
  type MVL9_indexed_by_char is array (CHARACTER) of STD_ULOGIC;
  type MVL9plus_indexed_by_char is array (CHARACTER) of MVL9plus;

  constant MVL9_to_char : char_indexed_by_MVL9 := "UX01ZWLH-";
  constant char_to_MVL9 : MVL9_indexed_by_char :=
    ('U' => 'U', 'X' => 'X', '0' => '0', '1' => '1', 'Z' => 'Z',
     'W' => 'W', 'L' => 'L', 'H' => 'H', '-' => '-', others => 'U');
  constant char_to_MVL9plus : MVL9plus_indexed_by_char :=
    ('U' => 'U', 'X' => 'X', '0' => '0', '1' => '1', 'Z' => 'Z',
     'W' => 'W', 'L' => 'L', 'H' => 'H', '-' => '-', others => error);
  constant NBSP : CHARACTER      := CHARACTER'val(160);  -- space character
  constant NUS  : STRING(2 to 1) := (others => ' ');

  -- purpose: writes fixed point into a line
  procedure write (
    L         : inout LINE;             -- input line
    VALUE     : in    ufixed;           -- fixed point input
    JUSTIFIED : in    SIDE  := right;
    FIELD     : in    WIDTH := 0) is
    variable s     : STRING(1 to value'length +1) := (others => ' ');
    variable sindx : INTEGER;
  begin  -- function write   Example: 0011.1100
    sindx := 1;
    for i in value'high downto value'low loop
      if i = -1 then
        s(sindx) := '.';
        sindx    := sindx +1;
      end if;
      s(sindx) := MVL9_to_char(STD_ULOGIC(value(i)));
      sindx    := sindx +1;
    end loop;
    write(l, s, justified, field);
  end procedure write;

  -- purpose: writes fixed point into a line
  procedure write (
    L         : inout LINE;             -- input line
    VALUE     : in    sfixed;           -- fixed point input
    JUSTIFIED : in    SIDE  := right;
    FIELD     : in    WIDTH := 0) is
    variable s     : STRING(1 to value'length +1);
    variable sindx : INTEGER;
  begin  -- function write   Example: 0011.1100
    sindx := 1;
    for i in value'high downto value'low loop
      if i = -1 then
        s(sindx) := '.';
        sindx    := sindx +1;
      end if;
      s(sindx) := MVL9_to_char(STD_ULOGIC(value(i)));
      sindx    := sindx +1;
    end loop;
    write(l, s, justified, field);
  end procedure write;

  procedure READ(L     : inout LINE;
                 VALUE : out   ufixed) is
    -- Possible data:  00000.0000000
    --                 000000000000
    variable c      : CHARACTER;
    variable s      : STRING(1 to value'length-1);
    variable readOk : BOOLEAN;
    variable i      : INTEGER;          -- index variable
  begin  -- READ
    VALUE (VALUE'range) := (others => 'U');
    loop                                -- skip white space
      read(l, c, readOk);
      exit when (readOk = false) or ((c /= ' ') and (c /= NBSP) and (c /= HT));
    end loop;
    i := value'high;
    readloop : loop
      if readOk = false then            -- Bail out if there was a bad read
        report "FIXED_GENERIC_PKG.READ(ufixed) "
          & "Error: end of string encountered"
          severity error;
        return;
      elsif c = ' ' or c = NBSP or c = HT then  -- reading done.
        assert i = value'low
          report "FIXED_GENERIC_PKG.READ(ufixed) "
          & "Warning: Value truncated " severity warning;
        return;
      elsif c = '.' then                -- separator, ignore
        assert (i = -1)
          report "FIXED_GENERIC_PKG.READ(ufixed) "
          & "Warning: Decimal point does not match number format "
          severity warning;
      elsif (char_to_MVL9plus(c) = error) then
        report "FIXED_GENERIC_PKG.READ(ufixed) "
          & "Error: Character '" & c & "' read, expected STD_ULOGIC literal."
          severity error;
        return;
      else
        value (i) := char_to_MVL9(c);
        i         := i - 1;
        if i < value'low then
          return;
        end if;
      end if;
      read(l, c, readOk);
    end loop readloop;
  end procedure READ;

  procedure READ(L     : inout LINE;
                 VALUE : out   ufixed;
                 GOOD  : out   BOOLEAN) is
    -- Possible data:  00000.0000000
    --                 000000000000
    variable c      : CHARACTER;
    variable i      : INTEGER;          -- index variable
    variable readOk : BOOLEAN;
  begin  -- READ
    VALUE (VALUE'range) := (others => 'U');
    loop                                -- skip white space
      read(l, c, readOk);
      exit when (readOk = false) or ((c /= ' ') and (c /= NBSP) and (c /= HT));
    end loop;
    i    := value'high;
    good := true;
    readloop : loop
      if readOk = false then            -- Bail out if there was a bad read
        good := false;
        return;
      elsif c = ' ' or c = NBSP or c = HT then  -- reading done
        good := false;
        return;
      elsif c = '.' then                -- separator, ignore
        good := (i = -1);
      elsif (char_to_MVL9plus(c) = error) then
        good := false;
        return;
      else
        value (i) := char_to_MVL9(c);
        i         := i - 1;
        if i < value'low then
          return;
        end if;
      end if;
      read(l, c, readOk);
    end loop readloop;
  end procedure READ;

  procedure READ(L     : inout LINE;
                 VALUE : out   sfixed) is
    -- Possible data:  00000.0000000
    --                 000000000000
    variable c      : CHARACTER;
    variable readOk : BOOLEAN;
    variable i      : INTEGER;          -- index variable
  begin  -- READ
    VALUE (VALUE'range) := (others => 'U');
    loop                                -- skip white space
      read(l, c, readOk);
      exit when (readOk = false) or ((c /= ' ') and (c /= NBSP) and (c /= HT));
    end loop;
    i := value'high;
    readloop : loop
      if readOk = false then            -- Bail out if there was a bad read
        report "FIXED_GENERIC_PKG.READ(sfixed) "
          & "Error end of string encountered"
          severity error;
        return;
      elsif c = ' ' or c = NBSP or c = HT then  -- reading done.
        assert i = value'low
          report "FIXED_GENERIC_PKG.READ(sfixed) "
          & "Warning: Value truncated " severity warning;
        return;
      elsif c = '.' then                -- separator, ignore
        assert (i = -1)
          report "FIXED_GENERIC_PKG.READ(sfixed) "
          & "Warning: Decimal point does not match number format "
          severity warning;
      elsif (char_to_MVL9plus(c) = error) then
        report "FIXED_GENERIC_PKG.READ(sfixed) "
          & "Error: Character '" & c & "' read, expected STD_ULOGIC literal."
          severity error;
        return;
      else
        value (i) := char_to_MVL9(c);
        i         := i - 1;
        if i < value'low then
          return;
        end if;
      end if;
      read(l, c, readOk);
    end loop readloop;
  end procedure READ;

  procedure READ(L     : inout LINE;
                 VALUE : out   sfixed;
                 GOOD  : out   BOOLEAN) is
    -- Possible data:  00000.0000000
    --                 000000000000
    variable c      : CHARACTER;
    variable i      : INTEGER;          -- index variable
    variable readOk : BOOLEAN;
  begin  -- READ
    VALUE (VALUE'range) := (others => 'U');
    loop                                -- skip white space
      read(l, c, readOk);
      exit when (readOk = false) or ((c /= ' ') and (c /= NBSP) and (c /= HT));
    end loop;
    i    := value'high;
    good := true;
    readloop : loop
      if readOk = false then            -- Bail out if there was a bad read
        good := false;
        return;
      elsif c = ' ' or c = NBSP or c = HT then  -- reading done
        good := false;
        return;
      elsif c = '.' then                -- separator, ignore
        good := (i = -1);
      elsif (char_to_MVL9plus(c) = error) then
        good := false;
        return;
      else
        value (i) := char_to_MVL9(c);
        i         := i - 1;
        if i < value'low then
          return;
        end if;
      end if;
      read(l, c, readOk);
    end loop readloop;
  end procedure READ;

  -- octal read and write
  procedure owrite (
    L         : inout LINE;             -- input line
    VALUE     : in    ufixed;           -- fixed point input
    JUSTIFIED : in    SIDE  := right;
    FIELD     : in    WIDTH := 0) is
  begin  -- Example 03.30
    write (L         => L,
           VALUE     => to_ostring (VALUE),
           JUSTIFIED => JUSTIFIED,
           FIELD     => FIELD);
  end procedure owrite;

  procedure owrite (
    L         : inout LINE;             -- input line
    VALUE     : in    sfixed;           -- fixed point input
    JUSTIFIED : in    SIDE  := right;
    FIELD     : in    WIDTH := 0) is
  begin  -- Example 03.30
    write (L         => L,
           VALUE     => to_ostring (VALUE),
           JUSTIFIED => JUSTIFIED,
           FIELD     => FIELD);
  end procedure owrite;

  procedure Char2TriBits (C           :     CHARACTER;
                          RESULT      : out STD_LOGIC_VECTOR(2 downto 0);
                          GOOD        : out BOOLEAN;
                          ISSUE_ERROR : in  BOOLEAN) is
  begin
    case c is
      when '0'    => result := o"0"; good := true;
      when '1'    => result := o"1"; good := true;
      when '2'    => result := o"2"; good := true;
      when '3'    => result := o"3"; good := true;
      when '4'    => result := o"4"; good := true;
      when '5'    => result := o"5"; good := true;
      when '6'    => result := o"6"; good := true;
      when '7'    => result := o"7"; good := true;
      when 'Z'    => result := "ZZZ"; good := true;
      when 'X'    => result := "XXX"; good := true;
      when others =>
        assert not ISSUE_ERROR
          report
          "FIXED_GENERIC_PKG.OREAD Error: Read a '" & c &
          "', expected an Octal character (0-7)."
          severity error;
        result := "UUU";
        good   := false;
    end case;
  end procedure Char2TriBits;

  -- Note that for Octal and Hex read, you can not start with a ".",
  -- the read is for numbers formatted "A.BC".  These routines go to
  -- the nearest bounds, so "F.E" will fit into an sfixed (2 downto -3).
  procedure OREAD(L     : inout LINE;
                  VALUE : out   ufixed) is
    constant hbv    : INTEGER := (((maximum(3, (VALUE'high+1))+2)/3)*3)-1;
    constant lbv    : INTEGER := ((mine(-3, VALUE'low)-2)/3)*3;
    variable slv    : STD_LOGIC_VECTOR (hbv-lbv downto 0);  -- high bits
    variable c      : CHARACTER;        -- to read the "."
    variable valuex : ufixed (hbv downto lbv);
    variable igood  : BOOLEAN;
    variable nybble : STD_LOGIC_VECTOR (2 downto 0);        -- 3 bits
    variable i      : INTEGER;
  begin
    VALUE (VALUE'range) := (others => 'U');  -- initialize to a "U"
    loop                                -- skip white space
      read(L, c, igood);
      exit when (igood = false) or ((c /= ' ') and (c /= NBSP) and (c /= HT));
    end loop;
    if igood = false then
      report "FIXED_GENERIC_PKG.OREAD(ufixed): "
        & "Error end of string encountered"
        severity error;
      return;
    else
      Char2triBits(c, nybble, igood, true);
      i                        := hbv-lbv - 3;              -- Top - 3
      slv (hbv-lbv downto i+1) := nybble;
    end if;
    while (i /= -1) and igood and L.all'length /= 0 loop
      read (L, c, igood);
      if igood = false then
        report "FIXED_GENERIC_PKG.OREAD(ufixed): "
          & "Error end of string encountered"
          severity error;
      elsif (c = '.') then
        if (i + 1 /= -lbv) then
          igood := false;
          report "FIXED_GENERIC_PKG.OREAD(ufixed): "
            & "encountered ""."" at wrong index"
            severity error;
        end if;
      else
        Char2TriBits(c, nybble, igood, true);
        slv (i downto i-2) := nybble;
        i                  := i - 3;
      end if;
    end loop;
    if igood then                       -- We did not get another error
      assert (i = -1) and               -- We read everything, and high bits 0
        (or_reducex(slv(hbv-lbv downto VALUE'high+1-lbv)) = '0')
        report "FIXED_GENERIC_PKG.OREAD(ufixed): Vector truncated."
        severity error;
      if (or_reducex(slv(VALUE'low-lbv-1 downto 0)) = '1') then
        assert NO_WARNING
          report "FIXED_GENERIC_PKG.OREAD(ufixed): Vector truncated"
          severity warning;
      end if;
    end if;
    valuex := to_ufixed (slv, hbv, lbv);
    VALUE  := valuex (VALUE'range);
  end procedure OREAD;

  procedure OREAD(L     : inout LINE;
                  VALUE : out   ufixed;
                  GOOD  : out   BOOLEAN) is
    constant hbv    : INTEGER := (((maximum(3, (VALUE'high+1))+2)/3)*3)-1;
    constant lbv    : INTEGER := ((mine(-3, VALUE'low)-2)/3)*3;
    variable slv    : STD_LOGIC_VECTOR (hbv-lbv downto 0);  -- high bits
    variable c      : CHARACTER;        -- to read the "."
    variable valuex : ufixed (hbv downto lbv);
    variable igood  : BOOLEAN;
    variable nybble : STD_LOGIC_VECTOR (2 downto 0);        -- 3 bits
    variable i      : INTEGER;
  begin
    VALUE (VALUE'range) := (others => 'U');  -- initialize to a "U"
    loop                                -- skip white space
      read(L, c, igood);
      exit when (igood = false) or ((c /= ' ') and (c /= NBSP) and (c /= HT));
    end loop;
    if igood = false then
      return;
    else
      Char2triBits(c, nybble, igood, false);
      i                        := hbv-lbv - 3;              -- Top - 3
      slv (hbv-lbv downto i+1) := nybble;
    end if;
    while (i /= -1) and igood and L.all'length /= 0 loop
      read (L, c, igood);
      if igood then
        if (c = '.') then
          igood := igood and (i + 1 = -lbv);
        else
          Char2TriBits(c, nybble, igood, false);
          slv (i downto i-2) := nybble;
          i                  := i - 3;
        end if;
      end if;
    end loop;
    good := igood and                   -- We did not get another error
            (i = -1) and                -- We read everything, and high bits 0
            (or_reducex(slv(hbv-lbv downto VALUE'high+1-lbv)) = '0');
    valuex := to_ufixed (slv, hbv, lbv);
    VALUE  := valuex (VALUE'range);
  end procedure OREAD;

  procedure OREAD(L     : inout LINE;
                  VALUE : out   sfixed) is
    constant hbv    : INTEGER := (((maximum(3, (VALUE'high+1))+2)/3)*3)-1;
    constant lbv    : INTEGER := ((mine(-3, VALUE'low)-2)/3)*3;
    variable slv    : STD_LOGIC_VECTOR (hbv-lbv downto 0);  -- high bits
    variable c      : CHARACTER;        -- to read the "."
    variable valuex : sfixed (hbv downto lbv);
    variable igood  : BOOLEAN;
    variable nybble : STD_LOGIC_VECTOR (2 downto 0);        -- 3 bits
    variable i      : INTEGER;
  begin
    VALUE (VALUE'range) := (others => 'U');  -- initialize to a "U"
    loop                                -- skip white space
      read(L, c, igood);
      exit when (igood = false) or ((c /= ' ') and (c /= NBSP) and (c /= HT));
    end loop;
    if igood = false then
      report "FIXED_GENERIC_PKG.OREAD(sfixed): "
        & "Error end of string encountered"
        severity error;
      return;
    else
      Char2triBits(c, nybble, igood, true);
      i                        := hbv-lbv - 3;              -- Top - 3
      slv (hbv-lbv downto i+1) := nybble;
    end if;
    while (i /= -1) and igood and L.all'length /= 0 loop
      read (L, c, igood);
      if igood = false then
        report "FIXED_GENERIC_PKG.OREAD(sfixed): "
          & "Error end of string encountered"
          severity error;
      elsif (c = '.') then
        if (i + 1 /= -lbv) then
          igood := false;
          report "FIXED_GENERIC_PKG.OREAD(sfixed): "
            & "encountered ""."" at wrong index"
            severity error;
        end if;
      else
        Char2TriBits(c, nybble, igood, true);
        slv (i downto i-2) := nybble;
        i                  := i - 3;
      end if;
    end loop;
    if igood then                       -- We did not get another error
      assert (i = -1) and               -- We read everything
        ((slv(VALUE'high-lbv) = '0' and      -- sign bits = extra bits
          or_reducex(slv(hbv-lbv downto VALUE'high+1-lbv)) = '0') or
         (slv(VALUE'high-lbv) = '1' and
          and_reducex(slv(hbv-lbv downto VALUE'high+1-lbv)) = '1'))
        report "FIXED_GENERIC_PKG.OREAD(sfixed): Vector truncated."
        severity error;
      if (or_reducex(slv(VALUE'low-lbv-1 downto 0)) = '1') then
        assert NO_WARNING
          report "FIXED_GENERIC_PKG.OREAD(sfixed): Vector truncated"
          severity warning;
      end if;
    end if;
    valuex := to_sfixed (slv, hbv, lbv);
    VALUE  := valuex (VALUE'range);
  end procedure OREAD;

  procedure OREAD(L     : inout LINE;
                  VALUE : out   sfixed;
                  GOOD  : out   BOOLEAN) is
    constant hbv    : INTEGER := (((maximum(3, (VALUE'high+1))+2)/3)*3)-1;
    constant lbv    : INTEGER := ((mine(-3, VALUE'low)-2)/3)*3;
    variable slv    : STD_LOGIC_VECTOR (hbv-lbv downto 0);  -- high bits
    variable c      : CHARACTER;        -- to read the "."
    variable valuex : sfixed (hbv downto lbv);
    variable igood  : BOOLEAN;
    variable nybble : STD_LOGIC_VECTOR (2 downto 0);        -- 3 bits
    variable i      : INTEGER;
  begin
    VALUE (VALUE'range) := (others => 'U');      -- initialize to a "U"
    loop                                -- skip white space
      read(L, c, igood);
      exit when (igood = false) or ((c /= ' ') and (c /= NBSP) and (c /= HT));
    end loop;
    if igood = false then
      return;
    else
      Char2triBits(c, nybble, igood, false);
      i                        := hbv-lbv - 3;   -- Top - 3
      slv (hbv-lbv downto i+1) := nybble;
    end if;
    while (i /= -1) and igood and L.all'length /= 0 loop
      read (L, c, igood);
      if igood then
        if (c = '.') then
          igood := igood and (i + 1 = -lbv);
        else
          Char2TriBits(c, nybble, igood, false);
          slv (i downto i-2) := nybble;
          i                  := i - 3;
        end if;
      end if;
    end loop;
    good := igood                       -- We did not get another error
            and (i = -1)                -- We read everything
            and ((slv(VALUE'high-lbv) = '0' and  -- sign bits = extra bits
                  or_reducex(slv(hbv-lbv downto VALUE'high+1-lbv)) = '0') or
                 (slv(VALUE'high-lbv) = '1' and
                  and_reducex(slv(hbv-lbv downto VALUE'high+1-lbv)) = '1'));
    valuex := to_sfixed (slv, hbv, lbv);
    VALUE  := valuex (VALUE'range);
  end procedure OREAD;

  -- hex read and write
  procedure hwrite (
    L         : inout LINE;             -- input line
    VALUE     : in    ufixed;           -- fixed point input
    JUSTIFIED : in    SIDE  := right;
    FIELD     : in    WIDTH := 0) is
  begin  -- Example 03.30
    write (L         => L,
           VALUE     => to_hstring (VALUE),
           JUSTIFIED => JUSTIFIED,
           FIELD     => FIELD);
  end procedure hwrite;

  -- purpose: writes fixed point into a line
  procedure hwrite (
    L         : inout LINE;             -- input line
    VALUE     : in    sfixed;           -- fixed point input
    JUSTIFIED : in    SIDE  := right;
    FIELD     : in    WIDTH := 0) is
  begin  -- Example 03.30
    write (L         => L,
           VALUE     => to_hstring (VALUE),
           JUSTIFIED => JUSTIFIED,
           FIELD     => FIELD);
  end procedure hwrite;

  -- Hex Read and Write procedures for STD_ULOGIC_VECTOR.
  -- Modified from the original to be more forgiving.

  procedure Char2QuadBits (C           :     CHARACTER;
                           RESULT      : out STD_LOGIC_VECTOR(3 downto 0);
                           GOOD        : out BOOLEAN;
                           ISSUE_ERROR : in  BOOLEAN) is
  begin
    case c is
      when '0'       => result := x"0"; good := true;
      when '1'       => result := x"1"; good := true;
      when '2'       => result := x"2"; good := true;
      when '3'       => result := x"3"; good := true;
      when '4'       => result := x"4"; good := true;
      when '5'       => result := x"5"; good := true;
      when '6'       => result := x"6"; good := true;
      when '7'       => result := x"7"; good := true;
      when '8'       => result := x"8"; good := true;
      when '9'       => result := x"9"; good := true;
      when 'A' | 'a' => result := x"A"; good := true;
      when 'B' | 'b' => result := x"B"; good := true;
      when 'C' | 'c' => result := x"C"; good := true;
      when 'D' | 'd' => result := x"D"; good := true;
      when 'E' | 'e' => result := x"E"; good := true;
      when 'F' | 'f' => result := x"F"; good := true;
      when 'Z'       => result := "ZZZZ"; good := true;
      when 'X'       => result := "XXXX"; good := true;
      when others    =>
        assert not ISSUE_ERROR
          report
          "FIXED_GENERIC_PKG.HREAD Error: Read a '" & c &
          "', expected a Hex character (0-F)."
          severity error;
        result := "UUUU";
        good   := false;
    end case;
  end procedure Char2QuadBits;

  procedure HREAD(L     : inout LINE;
                  VALUE : out   ufixed) is
    constant hbv    : INTEGER := (((maximum(4, (VALUE'high+1))+3)/4)*4)-1;
    constant lbv    : INTEGER := ((mine(-4, VALUE'low)-3)/4)*4;
    variable slv    : STD_LOGIC_VECTOR (hbv-lbv downto 0);  -- high bits
    variable c      : CHARACTER;        -- to read the "."
    variable valuex : ufixed (hbv downto lbv);
    variable igood  : BOOLEAN;
    variable nybble : STD_LOGIC_VECTOR (3 downto 0);        -- 4 bits
    variable i      : INTEGER;
  begin
    VALUE (VALUE'range) := (others => 'U');  -- initialize to a "U"
    loop                                -- skip white space
      read(L, c, igood);
      exit when (igood = false) or ((c /= ' ') and (c /= NBSP) and (c /= HT));
    end loop;
    if igood = false then
      report "FIXED_GENERIC_PKG.HREAD(ufixed): "
        & "Error end of string encountered"
        severity error;
      return;
    else
      Char2QuadBits(c, nybble, igood, true);
      i                        := hbv-lbv - 4;              -- Top - 4
      slv (hbv-lbv downto i+1) := nybble;
    end if;
    while (i /= -1) and igood and L.all'length /= 0 loop
      read (L, c, igood);
      if igood = false then
        report "FIXED_GENERIC_PKG.HREAD(ufixed): "
          & "Error end of string encountered"
          severity error;
      elsif (c = '.') then
        if (i + 1 /= -lbv) then
          igood := false;
          report "FIXED_GENERIC_PKG.HREAD(ufixed): "
            & "encountered ""."" at wrong index"
            severity error;
        end if;
      else
        Char2QuadBits(c, nybble, igood, true);
        slv (i downto i-3) := nybble;
        i                  := i - 4;
      end if;
    end loop;
    if igood then                       -- We did not get another error
      assert (i = -1) and               -- We read everything, and high bits 0
        (or_reducex(slv(hbv-lbv downto VALUE'high+1-lbv)) = '0')
        report "FIXED_GENERIC_PKG.HREAD(ufixed): Vector truncated."
        severity error;
      if (or_reducex(slv(VALUE'low-lbv-1 downto 0)) = '1') then
        assert NO_WARNING
          report "FIXED_GENERIC_PKG.HREAD(ufixed): Vector truncated"
          severity warning;
      end if;
    end if;
    valuex := to_ufixed (slv, hbv, lbv);
    VALUE  := valuex (VALUE'range);
  end procedure HREAD;

  procedure HREAD(L     : inout LINE;
                  VALUE : out   ufixed;
                  GOOD  : out   BOOLEAN) is
    constant hbv    : INTEGER := (((maximum(4, (VALUE'high+1))+3)/4)*4)-1;
    constant lbv    : INTEGER := ((mine(-4, VALUE'low)-3)/4)*4;
    variable slv    : STD_LOGIC_VECTOR (hbv-lbv downto 0);  -- high bits
    variable c      : CHARACTER;        -- to read the "."
    variable valuex : ufixed (hbv downto lbv);
    variable igood  : BOOLEAN;
    variable nybble : STD_LOGIC_VECTOR (3 downto 0);        -- 4 bits
    variable i      : INTEGER;
  begin
    VALUE (VALUE'range) := (others => 'U');  -- initialize to a "U"
    loop                                -- skip white space
      read(L, c, igood);
      exit when (igood = false) or ((c /= ' ') and (c /= NBSP) and (c /= HT));
    end loop;
    if igood = false then
      return;
    else
      Char2QuadBits(c, nybble, igood, false);
      i                        := hbv-lbv - 4;              -- Top - 4
      slv (hbv-lbv downto i+1) := nybble;
    end if;
    while (i /= -1) and igood and L.all'length /= 0 loop
      read (L, c, igood);
      if igood then
        if (c = '.') then
          igood := igood and (i + 1 = -lbv);
        else
          Char2QuadBits(c, nybble, igood, false);
          slv (i downto i-3) := nybble;
          i                  := i - 4;
        end if;
      end if;
    end loop;
    good := igood and                   -- We did not get another error
            (i = -1) and                -- We read everything, and high bits 0
            (or_reducex(slv(hbv-lbv downto VALUE'high+1-lbv)) = '0');
    valuex := to_ufixed (slv, hbv, lbv);
    VALUE  := valuex (VALUE'range);
  end procedure HREAD;

  procedure HREAD(L     : inout LINE;
                  VALUE : out   sfixed) is
    constant hbv    : INTEGER := (((maximum(4, (VALUE'high+1))+3)/4)*4)-1;
    constant lbv    : INTEGER := ((mine(-4, VALUE'low)-3)/4)*4;
    variable slv    : STD_LOGIC_VECTOR (hbv-lbv downto 0);  -- high bits
    variable c      : CHARACTER;        -- to read the "."
    variable valuex : sfixed (hbv downto lbv);
    variable igood  : BOOLEAN;
    variable nybble : STD_LOGIC_VECTOR (3 downto 0);        -- 4 bits
    variable i      : INTEGER;
  begin
    VALUE (VALUE'range) := (others => 'U');  -- initialize to a "U"
    loop                                -- skip white space
      read(L, c, igood);
      exit when (igood = false) or ((c /= ' ') and (c /= NBSP) and (c /= HT));
    end loop;
    if igood = false then
      report "FIXED_GENERIC_PKG.HREAD(sfixed): "
        & "Error end of string encountered"
        severity error;
      return;
    else
      Char2QuadBits(c, nybble, igood, true);
      i                        := hbv-lbv - 4;              -- Top - 4
      slv (hbv-lbv downto i+1) := nybble;
    end if;
    while (i /= -1) and igood and L.all'length /= 0 loop
      read (L, c, igood);
      if igood = false then
        report "FIXED_GENERIC_PKG.HREAD(sfixed): "
          & "Error end of string encountered"
          severity error;
      elsif (c = '.') then
        if (i + 1 /= -lbv) then
          igood := false;
          report "FIXED_GENERIC_PKG.HREAD(sfixed): "
            & "encountered ""."" at wrong index"
            severity error;
        end if;
      else
        Char2QuadBits(c, nybble, igood, true);
        slv (i downto i-3) := nybble;
        i                  := i - 4;
      end if;
    end loop;
    if igood then                       -- We did not get another error
      assert (i = -1)                   -- We read everything
        and ((slv(VALUE'high-lbv) = '0' and  -- sign bits = extra bits
              or_reducex(slv(hbv-lbv downto VALUE'high+1-lbv)) = '0') or
             (slv(VALUE'high-lbv) = '1' and
              and_reducex(slv(hbv-lbv downto VALUE'high+1-lbv)) = '1'))
        report "FIXED_GENERIC_PKG.HREAD(sfixed): Vector truncated."
        severity error;
      if (or_reducex(slv(VALUE'low-lbv-1 downto 0)) = '1') then
        assert NO_WARNING
          report "FIXED_GENERIC_PKG.HREAD(sfixed): Vector truncated"
          severity warning;
      end if;
    end if;
    valuex := to_sfixed (slv, hbv, lbv);
    VALUE  := valuex (VALUE'range);
  end procedure HREAD;

  procedure HREAD(L     : inout LINE;
                  VALUE : out   sfixed;
                  GOOD  : out   BOOLEAN) is
    constant hbv    : INTEGER := (((maximum(4, (VALUE'high+1))+3)/4)*4)-1;
    constant lbv    : INTEGER := ((mine(-4, VALUE'low)-3)/4)*4;
    variable slv    : STD_LOGIC_VECTOR (hbv-lbv downto 0);  -- high bits
    variable c      : CHARACTER;        -- to read the "."
    variable valuex : sfixed (hbv downto lbv);
    variable igood  : BOOLEAN;
    variable nybble : STD_LOGIC_VECTOR (3 downto 0);        -- 4 bits
    variable i      : INTEGER;
  begin
    VALUE (VALUE'range) := (others => 'U');  -- initialize to a "U"
    loop                                -- skip white space
      read(L, c, igood);
      exit when (igood = false) or ((c /= ' ') and (c /= NBSP) and (c /= HT));
    end loop;
    if igood = false then
      return;
    else
      Char2QuadBits(c, nybble, igood, false);
      i                        := hbv-lbv - 4;              -- Top - 4
      slv (hbv-lbv downto i+1) := nybble;
    end if;
    while (i /= -1) and igood and L.all'length /= 0 loop
      read (L, c, igood);
      if igood then
        if (c = '.') then
          igood := igood and (i + 1 = -lbv);
        else
          Char2QuadBits(c, nybble, igood, false);
          slv (i downto i-3) := nybble;
          i                  := i - 4;
        end if;
      end if;
    end loop;
    good := igood and                   -- We did not get another error
            (i = -1) and                -- We read everything
            ((slv(VALUE'high-lbv) = '0' and  -- sign bits = extra bits
              or_reducex(slv(hbv-lbv downto VALUE'high+1-lbv)) = '0') or
             (slv(VALUE'high-lbv) = '1' and
              and_reducex(slv(hbv-lbv downto VALUE'high+1-lbv)) = '1'));
    valuex := to_sfixed (slv, hbv, lbv);
    VALUE  := valuex (VALUE'range);
  end procedure HREAD;

  -----------------------------------------------------------------------------
  -- %%% Remove the following 3 functions.  They are a duplicate needed for
  -- testing
  -----------------------------------------------------------------------------
  -- purpose: Justify a string to the right
  function justify (
    value     : STRING;
    justified : SIDE  := right;
    field     : width := 0)
    return STRING is
    constant VAL_LEN : INTEGER             := value'length;
    variable result  : STRING (1 to field) := (others => ' ');
  begin  -- function justify
    -- return value if field is too small
    if VAL_LEN >= field then
      return value;
    end if;
    if justified = left then
      result(1 to VAL_LEN) := value;
    elsif justified = right then
      result(field - VAL_LEN + 1 to field) := value;
    end if;
    return result;
  end function justify;

  function to_ostring (
    value     : STD_LOGIC_VECTOR;
    justified : SIDE  := right;
    field     : width := 0
    ) return STRING is
    constant ne     : INTEGER := (value'length+2)/3;
    variable pad    : STD_LOGIC_VECTOR(0 to (ne*3 - value'length) - 1);
    variable ivalue : STD_LOGIC_VECTOR(0 to ne*3 - 1);
    variable result : STRING(1 to ne);
    variable tri    : STD_LOGIC_VECTOR(0 to 2);
  begin
    if value'length < 1 then
      return NUS;
    else
      if value (value'left) = 'Z' then
        pad := (others => 'Z');
      else
        pad := (others => '0');
      end if;
      ivalue := pad & value;
      for i in 0 to ne-1 loop
        tri := To_X01Z(ivalue(3*i to 3*i+2));
        case tri is
          when o"0"   => result(i+1) := '0';
          when o"1"   => result(i+1) := '1';
          when o"2"   => result(i+1) := '2';
          when o"3"   => result(i+1) := '3';
          when o"4"   => result(i+1) := '4';
          when o"5"   => result(i+1) := '5';
          when o"6"   => result(i+1) := '6';
          when o"7"   => result(i+1) := '7';
          when "ZZZ"  => result(i+1) := 'Z';
          when others => result(i+1) := 'X';
        end case;
      end loop;
      return justify(result, justified, field);
    end if;
  end function to_ostring;
  -------------------------------------------------------------------   
  function to_hstring (
    value     : STD_LOGIC_VECTOR;
    justified : SIDE  := right;
    field     : width := 0
    ) return STRING is
    constant ne     : INTEGER := (value'length+3)/4;
    variable pad    : STD_LOGIC_VECTOR(0 to (ne*4 - value'length) - 1);
    variable ivalue : STD_LOGIC_VECTOR(0 to ne*4 - 1);
    variable result : STRING(1 to ne);
    variable quad   : STD_LOGIC_VECTOR(0 to 3);
  begin
    if value'length < 1 then
      return NUS;
    else
      if value (value'left) = 'Z' then
        pad := (others => 'Z');
      else
        pad := (others => '0');
      end if;
      ivalue := pad & value;
      for i in 0 to ne-1 loop
        quad := To_X01Z(ivalue(4*i to 4*i+3));
        case quad is
          when x"0"   => result(i+1) := '0';
          when x"1"   => result(i+1) := '1';
          when x"2"   => result(i+1) := '2';
          when x"3"   => result(i+1) := '3';
          when x"4"   => result(i+1) := '4';
          when x"5"   => result(i+1) := '5';
          when x"6"   => result(i+1) := '6';
          when x"7"   => result(i+1) := '7';
          when x"8"   => result(i+1) := '8';
          when x"9"   => result(i+1) := '9';
          when x"A"   => result(i+1) := 'A';
          when x"B"   => result(i+1) := 'B';
          when x"C"   => result(i+1) := 'C';
          when x"D"   => result(i+1) := 'D';
          when x"E"   => result(i+1) := 'E';
          when x"F"   => result(i+1) := 'F';
          when "ZZZZ" => result(i+1) := 'Z';
          when others => result(i+1) := 'X';
        end case;
      end loop;
      return justify(result, justified, field);
    end if;
  end function to_hstring;
  -- %%% End remove here

  function to_string (
    value     : ufixed;
    justified : SIDE  := right;
    field     : width := 0
    ) return STRING is
    variable s     : STRING(1 to value'length +1) := (others => ' ');
    variable sindx : INTEGER;
  begin
    if value'length < 1 then
      return NUS;
    else
      if value'high < 0 then
        return to_string (resize (value, 0, value'low), justified, field);
      elsif value'low > 0 then
        return to_string (resize (value, value'high, -1), justified, field);
      else
        sindx := 1;
        for i in value'high downto value'low loop
          if i = -1 then
            s(sindx) := '.';
            sindx    := sindx +1;
          end if;
          s(sindx) := MVL9_to_char(STD_ULOGIC(value(i)));
          sindx    := sindx +1;
        end loop;
        return justify(s, justified, field);
      end if;
    end if;
  end function to_string;

  function to_string (
    value     : sfixed;
    justified : SIDE  := right;
    field     : width := 0
    ) return STRING is
    variable s     : STRING(1 to value'length +1) := (others => ' ');
    variable sindx : INTEGER;
  begin
    if value'length < 1 then
      return NUS;
    else
      if value'high < 0 then
        return to_string (resize (value, 0, value'low), justified, field);
      elsif value'low > 0 then
        return to_string (resize (value, value'high, -1), justified, field);
      else
        sindx := 1;
        for i in value'high downto value'low loop
          if i = -1 then
            s(sindx) := '.';
            sindx    := sindx +1;
          end if;
          s(sindx) := MVL9_to_char(STD_ULOGIC(value(i)));
          sindx    := sindx +1;
        end loop;
        return justify(s, justified, field);
      end if;
    end if;
  end function to_string;

  function to_ostring (
    value     : ufixed;
    justified : SIDE  := right;
    field     : width := 0
    ) return STRING is
    constant lne  : INTEGER := (-VALUE'low+2)/3;
    constant lpad : STD_LOGIC_VECTOR (0 to (lne*3 + VALUE'low) -1) :=
      (others => '0');
    variable slv : STD_LOGIC_VECTOR (value'length-1 downto 0);
  begin
    if value'length < 1 then
      return NUS;
    else
      if value'high < 0 then
        return to_ostring (resize (value, 2, value'low), justified, field);
      elsif value'low > 0 then
        return to_ostring (resize (value, value'high, -3), justified, field);
      else
        slv := to_slv (value);
        return justify(to_ostring(slv(slv'high downto slv'high-VALUE'high))
                       & "."
                       & to_ostring(slv(slv'high-VALUE'high-1 downto 0)&lpad),
                       justified, field);
      end if;
    end if;
  end function to_ostring;

  function to_hstring (
    value     : ufixed;
    justified : SIDE  := right;
    field     : width := 0
    ) return STRING is
    constant lne  : INTEGER := (-VALUE'low+3)/4;
    constant lpad : STD_LOGIC_VECTOR (0 to (lne*4 + VALUE'low) -1) :=
      (others => '0');
    variable slv : STD_LOGIC_VECTOR (value'length-1 downto 0);
  begin
    if value'length < 1 then
      return NUS;
    else
      if value'high < 0 then
        return to_hstring (resize (value, 3, value'low), justified, field);
      elsif value'low > 0 then
        return to_hstring (resize (value, value'high, -4), justified, field);
      else
        slv := to_slv (value);
        return justify(to_hstring(slv(slv'high downto slv'high-VALUE'high))
                       & "."
                       & to_hstring(slv(slv'high-VALUE'high-1 downto 0)&lpad),
                       justified, field);
      end if;
    end if;
  end function to_hstring;

  function to_ostring (
    value     : sfixed;
    justified : SIDE  := right;
    field     : width := 0
    ) return STRING is
    constant ne   : INTEGER := ((value'high+1)+2)/3;
    variable pad  : STD_LOGIC_VECTOR(0 to (ne*3 - (value'high+1)) - 1);
    constant lne  : INTEGER := (-VALUE'low+2)/3;
    constant lpad : STD_LOGIC_VECTOR (0 to (lne*3 + VALUE'low) -1) :=
      (others => '0');
    variable slv : STD_LOGIC_VECTOR (VALUE'high - VALUE'low downto 0);
  begin
    if value'length < 1 then
      return NUS;
    else
      pad := (others => value(value'high));
      if value'high < 0 then
        return to_ostring (resize (value, 2, value'low), justified, field);
      elsif value'low > 0 then
        return to_ostring (resize (value, value'high, -3), justified, field);
      else
        slv := to_slv (value);
        return justify(to_ostring(pad
                                  & slv(slv'high downto slv'high-VALUE'high))
                       & "."
                       & to_ostring(slv(slv'high-VALUE'high-1 downto 0)
                                    & lpad),
                       justified, field);
      end if;
    end if;
  end function to_ostring;

  function to_hstring (
    value     : sfixed;
    justified : SIDE  := right;
    field     : width := 0
    ) return STRING is
    constant ne   : INTEGER := ((value'high+1)+3)/4;
    variable pad  : STD_LOGIC_VECTOR(0 to (ne*4 - (value'high+1)) - 1);
    constant lne  : INTEGER := (-VALUE'low+3)/4;
    constant lpad : STD_LOGIC_VECTOR (0 to (lne*4 + VALUE'low) -1) :=
      (others => '0');
    variable slv : STD_LOGIC_VECTOR (value'length-1 downto 0);
  begin
    if value'length < 1 then
      return NUS;
    else
      pad := (others => value(value'high));
      if value'high < 0 then
        return to_hstring (resize (value, 3, value'low), justified, field);
      elsif value'low > 0 then
        return to_hstring (resize (value, value'high, -4), justified, field);
      else
        slv := to_slv (value);
        return justify(to_hstring(pad&slv(slv'high downto slv'high-VALUE'high))
                       & "."
                       & to_hstring(slv(slv'high-VALUE'high-1 downto 0)&lpad),
                       justified, field);
      end if;
    end if;
  end function to_hstring;

  -- From string functions allow you to convert a string into a fixed
  -- point number.  Example:
  --  signal uf1 : ufixed (3 downto -3);
  --  uf1 <= from_string ("0110.100", uf1'high, uf1'low); -- 6.5
  -- The "." is optional in this syntax, however it exist and is
  -- in the wrong location an error is produced.  Overflow will
  -- result in saturation.
  function from_string (
    bstring              : STRING;      -- binary string
    constant left_index  : INTEGER;
    constant right_index : INTEGER)
    return ufixed is
    variable result : ufixed (left_index downto right_index);
    variable L      : LINE;
    variable good   : BOOLEAN;
  begin
    L := new STRING'(bstring);
    read (L, result, good);
    deallocate (L);
    assert (good)
      report "fixed_generic_pkg.from_string: Bad string "& bstring severity error;
    return result;
  end function from_string;

  -- Octal and hex conversions work as follows:
  -- uf1 <= from_hstring ("6.8", 3, -3); -- 6.5 (bottom zeros dropped)
  -- uf1 <= from_ostring ("06.4", 3, -3); -- 6.5 (top zeros dropped)
  function from_ostring (
    ostring              : STRING;      -- Octal string
    constant left_index  : INTEGER;
    constant right_index : INTEGER)
    return ufixed is
    variable result : ufixed (left_index downto right_index);
    variable L      : LINE;
    variable good   : BOOLEAN;
  begin
    L := new STRING'(ostring);
    oread (L, result, good);
    deallocate (L);
    assert (good)
      report "fixed_generic_pkg.from_ostring: Bad string "& ostring severity error;
    return result;
  end function from_ostring;

  function from_hstring (
    hstring              : STRING;      -- hex string
    constant left_index  : INTEGER;
    constant right_index : INTEGER)
    return ufixed is
    variable result : ufixed (left_index downto right_index);
    variable L      : LINE;
    variable good   : BOOLEAN;
  begin
    L := new STRING'(hstring);
    hread (L, result, good);
    deallocate (L);
    assert (good)
      report "fixed_generic_pkg.from_hstring: Bad string "& hstring severity error;
    return result;
  end function from_hstring;
  
  function from_string (
    bstring              : STRING;      -- binary string
    constant left_index  : INTEGER;
    constant right_index : INTEGER)
    return sfixed is
    variable result : sfixed (left_index downto right_index);
    variable L      : LINE;
    variable good   : BOOLEAN;
  begin
    L := new STRING'(bstring);
    read (L, result, good);
    deallocate (L);
    assert (good)
      report "fixed_generic_pkg.from_string: Bad string "& bstring severity error;
    return result;
  end function from_string;

  function from_ostring (
    ostring              : STRING;      -- Octal string
    constant left_index  : INTEGER;
    constant right_index : INTEGER)
    return sfixed is
    variable result : sfixed (left_index downto right_index);
    variable L      : LINE;
    variable good   : BOOLEAN;
  begin
    L := new STRING'(ostring);
    oread (L, result, good);
    deallocate (L);
    assert (good)
      report "fixed_generic_pkg.from_ostring: Bad string "& ostring severity error;
    return result;
  end function from_ostring;

  function from_hstring (
    hstring              : STRING;      -- hex string
    constant left_index  : INTEGER;
    constant right_index : INTEGER)
    return sfixed is
    variable result : sfixed (left_index downto right_index);
    variable L      : LINE;
    variable good   : BOOLEAN;
  begin
    L := new STRING'(hstring);
    hread (L, result, good);
    deallocate (L);
    assert (good)
      report "fixed_generic_pkg.from_hstring: Bad string "& hstring severity error;
    return result;
  end function from_hstring;

  -- Same as above, "size_res" is used for it's range only.
  function from_string (
    bstring  : STRING;                  -- binary string
    size_res : ufixed)
    return ufixed is
    variable result : ufixed (size_res'high downto size_res'low);
    variable L      : LINE;
    variable good   : BOOLEAN;
  begin
    L := new STRING'(bstring);
    read (L, result, good);
    deallocate (L);
    assert (good)
      report "fixed_generic_pkg.from_string: Bad string "& bstring severity error;
    return result;
  end function from_string;

  function from_ostring (
    ostring  : STRING;                  -- Octal string
    size_res : ufixed)
    return ufixed is
    variable result : ufixed (size_res'high downto size_res'low);
    variable L      : LINE;
    variable good   : BOOLEAN;
  begin
    L := new STRING'(ostring);
    oread (L, result, good);
    deallocate (L);
    assert (good)
      report "fixed_generic_pkg.from_ostring: Bad string "& ostring severity error;
    return result;
  end function from_ostring;

  function from_hstring (
    hstring  : STRING;                  -- hex string
    size_res : ufixed)
    return ufixed is
    variable result : ufixed (size_res'high downto size_res'low);
    variable L      : LINE;
    variable good   : BOOLEAN;
  begin
    L := new STRING'(hstring);
    hread (L, result, good);
    deallocate (L);
    assert (good)
      report "fixed_generic_pkg.from_hstring: Bad string "& hstring severity error;
    return result;
  end function from_hstring;

  function from_string (
    bstring  : STRING;                  -- binary string
    size_res : sfixed)
    return sfixed is
    variable result : sfixed (size_res'high downto size_res'low);
    variable L      : LINE;
    variable good   : BOOLEAN;
  begin
    L := new STRING'(bstring);
    read (L, result, good);
    deallocate (L);
    assert (good)
      report "fixed_generic_pkg.from_string: Bad string "& bstring severity error;
    return result;
  end function from_string;

  function from_ostring (
    ostring  : STRING;                  -- Octal string
    size_res : sfixed)
    return sfixed is
    variable result : sfixed (size_res'high downto size_res'low);
    variable L      : LINE;
    variable good   : BOOLEAN;
  begin
    L := new STRING'(ostring);
    oread (L, result, good);
    deallocate (L);
    assert (good)
      report "fixed_generic_pkg.from_ostring: Bad string "& ostring severity error;
    return result;
  end function from_ostring;

  function from_hstring (
    hstring  : STRING;                  -- hex string
    size_res : sfixed)
    return sfixed is
    variable result : sfixed (size_res'high downto size_res'low);
    variable L      : LINE;
    variable good   : BOOLEAN;
  begin
    L := new STRING'(hstring);
    hread (L, result, good);
    deallocate (L);
    assert (good)
      report "fixed_generic_pkg.from_hstring: Bad string "& hstring severity error;
    return result;
  end function from_hstring;

  -- purpose: find a dot in a string, return -1 if no dot (internal function)
  function finddot (
    arg : STRING)
    return INTEGER is
    alias xarg : STRING (arg'length downto 1) is arg;  -- make it a downto
  begin
    for i in xarg'reverse_range loop
      if (xarg(i) = '.') then
        return i-1;
      end if;
    end loop;
    return -1;
  end function finddot;

  -- Direct converstion functions.  Example:
  --  signal uf1 : ufixed (3 downto -3);
  --  uf1 <= from_string ("0110.100"); -- 6.5
  -- In this case the "." is not optional, and the size of
  -- the output must match exactly.
  function from_string (
    bstring : STRING)                      -- binary string
    return ufixed is
    variable result        : ufixed (bstring'length-2 downto 0);
    variable result_nodot  : ufixed (bstring'length-1 downto 0);
    variable bstring_nodot : STRING (1 to bstring'length-1);
    variable L             : LINE;
    variable good          : BOOLEAN;
    variable dot, i, j     : INTEGER;
  begin
    dot := finddot(bstring);
    if (dot = -1) then
      L := new STRING'(bstring);
      read (L, result_nodot, good);
      assert (good)
        report "fixed_generic_pkg.from_string: Bad string "& bstring severity error;
      deallocate (L);
      return result_nodot;
    else
      j := 1;
      for i in 1 to bstring'high loop
        if (bstring(i) /= '.') then
          bstring_nodot(j) := bstring(i);  -- get rid of the dot.
          j                := j + 1;
        end if;
      end loop;
      L := new STRING'(bstring_nodot);
      read (L, result, good);
      assert (good)
        report "fixed_generic_pkg.from_string: Bad string "& bstring severity error;
      deallocate (L);
      return to_ufixed(to_slv(result), bstring'length-dot-2, -dot);
    end if;
  end function from_string;

  -- Direct octal and hex converstion functions.  In this case
  -- the string lengths must match.  Example:
  -- signal sf1 := sfixed (5 downto -3);
  -- sf1 <= from_ostring ("71.4") -- -6.5
  function from_ostring (
    ostring : STRING)                      -- Octal string
    return ufixed is
    variable result        : STD_LOGIC_VECTOR((ostring'length-1)*3-1 downto 0);
    variable result_nodot  : STD_LOGIC_VECTOR((ostring'length)*3-1 downto 0);
    variable ostring_nodot : STRING (1 to ostring'length-1);
    variable L             : LINE;
    variable good          : BOOLEAN;
    variable dot, i, j     : INTEGER;
  begin
    dot := finddot(ostring);
    if (dot = -1) then
      L := new STRING'(ostring);
      oread (L, result_nodot, good);
      assert (good)
        report "fixed_generic_pkg.from_ostring: Bad string "& ostring severity error;
      deallocate (L);
      return to_ufixed(UNSIGNED(result_nodot));
    else
      j := 1;
      for i in 1 to ostring'high loop
        if (ostring(i) /= '.') then
          ostring_nodot(j) := ostring(i);  -- get rid of the dot.
          j                := j + 1;
        end if;
      end loop;
      L := new STRING'(ostring_nodot);
      oread (L, result, good);
      assert (good)
        report "fixed_generic_pkg.from_ostring: Bad string "& ostring severity error;
      deallocate (L);
      return to_ufixed(result, (ostring'length-1-dot)*3-1, -dot*3);
    end if;
  end function from_ostring;

  function from_hstring (
    hstring : STRING)                      -- hex string
    return ufixed is
    variable result        : STD_LOGIC_VECTOR((hstring'length-1)*4-1 downto 0);
    variable result_nodot  : STD_LOGIC_VECTOR((hstring'length)*4-1 downto 0);
    variable hstring_nodot : STRING (1 to hstring'length-1);
    variable L             : LINE;
    variable good          : BOOLEAN;
    variable dot, i, j     : INTEGER;
  begin
    dot := finddot(hstring);
    if (dot = -1) then
      L := new STRING'(hstring);
      hread (L, result_nodot, good);
      assert (good)
        report "fixed_generic_pkg.from_hstring: Bad string "& hstring severity error;
      deallocate (L);
      return to_ufixed(UNSIGNED(result_nodot));
    else
      j := 1;
      for i in 1 to hstring'high loop
        if (hstring(i) /= '.') then
          hstring_nodot(j) := hstring(i);  -- get rid of the dot.
          j                := j + 1;
        end if;
      end loop;
      L := new STRING'(hstring_nodot);
      hread (L, result, good);
      assert (good)
        report "fixed_generic_pkg.from_hstring: Bad string "& hstring severity error;
      deallocate (L);
      return to_ufixed(result, (hstring'length-1-dot)*4-1, -dot*4);
    end if;
  end function from_hstring;

  function from_string (
    bstring : STRING)                      -- binary string
    return sfixed is
    variable result        : sfixed (bstring'length-2 downto 0);
    variable result_nodot  : sfixed (bstring'length-1 downto 0);
    variable bstring_nodot : STRING (1 to bstring'length-1);
    variable L             : LINE;
    variable good          : BOOLEAN;
    variable dot, i, j     : INTEGER;
  begin
    dot := finddot(bstring);
    if (dot = -1) then
      L := new STRING'(bstring);
      read (L, result_nodot, good);
      assert (good)
        report "fixed_generic_pkg.from_string: Bad string "& bstring severity error;
      deallocate (L);
      return result_nodot;
    else
      j := 1;
      for i in 1 to bstring'high loop
        if (bstring(i) /= '.') then
          bstring_nodot(j) := bstring(i);  -- get rid of the dot.
          j                := j + 1;
        end if;
      end loop;
      L := new STRING'(bstring_nodot);
      read (L, result, good);
      assert (good)
        report "fixed_generic_pkg.from_string: Bad string "& bstring severity error;
      deallocate (L);
      return to_sfixed(to_slv(result), bstring'length-dot-2, -dot);
    end if;
  end function from_string;

  function from_ostring (
    ostring : STRING)                      -- Octal string
    return sfixed is
    variable result        : STD_LOGIC_VECTOR((ostring'length-1)*3-1 downto 0);
    variable result_nodot  : STD_LOGIC_VECTOR((ostring'length)*3-1 downto 0);
    variable ostring_nodot : STRING (1 to ostring'length-1);
    variable L             : LINE;
    variable good          : BOOLEAN;
    variable dot, i, j     : INTEGER;
  begin
    dot := finddot(ostring);
    if (dot = -1) then
      L := new STRING'(ostring);
      oread (L, result_nodot, good);
      assert (good)
        report "fixed_generic_pkg.from_ostring: Bad string "& ostring severity error;
      deallocate (L);
      return to_sfixed(SIGNED(result_nodot));
    else
      j := 1;
      for i in 1 to ostring'high loop
        if (ostring(i) /= '.') then
          ostring_nodot(j) := ostring(i);  -- get rid of the dot.
          j                := j + 1;
        end if;
      end loop;
      L := new STRING'(ostring_nodot);
      oread (L, result, good);
      assert (good)
        report "fixed_generic_pkg.from_ostring: Bad string "& ostring severity error;
      deallocate (L);
      return to_sfixed(result, (ostring'length-1-dot)*3-1, -dot*3);
    end if;
  end function from_ostring;

  function from_hstring (
    hstring : STRING)                      -- hex string
    return sfixed is
    variable result        : STD_LOGIC_VECTOR((hstring'length-1)*4-1 downto 0);
    variable result_nodot  : STD_LOGIC_VECTOR((hstring'length)*4-1 downto 0);
    variable hstring_nodot : STRING (1 to hstring'length-1);
    variable L             : LINE;
    variable good          : BOOLEAN;
    variable dot, i, j     : INTEGER;
  begin
    dot := finddot(hstring);
    if (dot = -1) then
      L := new STRING'(hstring);
      hread (L, result_nodot, good);
      assert (good)
        report "fixed_generic_pkg.from_hstring: Bad string "& hstring severity error;
      deallocate (L);
      return sfixed(SIGNED(result_nodot));
    else
      j := 1;
      for i in 1 to hstring'high loop
        if (hstring(i) /= '.') then
          hstring_nodot(j) := hstring(i);  -- get rid of the dot.
          j                := j + 1;
        end if;
      end loop;
      L := new STRING'(hstring_nodot);
      hread (L, result, good);
      assert (good)
        report "fixed_generic_pkg.from_hstring: Bad string "& hstring severity error;
      deallocate (L);
      return to_sfixed(result, (hstring'length-1-dot)*4-1, -dot*4);
    end if;
  end function from_hstring;

-- synthesis translate_on
-- rtl_synthesis on
  function to_StdLogicVector (
    arg : ufixed)                       -- fp vector
    return STD_LOGIC_VECTOR is
  begin
    return to_slv (arg);
  end function to_StdLogicVector;
  function to_Std_Logic_Vector (
    arg : ufixed)                       -- fp vector
    return STD_LOGIC_VECTOR is
  begin
    return to_slv (arg);
  end function to_Std_Logic_Vector;
  function to_StdLogicVector (
    arg : sfixed)                       -- fp vector
    return STD_LOGIC_VECTOR is
  begin
    return to_slv (arg);
  end function to_StdLogicVector;
  function to_Std_Logic_Vector (
    arg : sfixed)                       -- fp vector
    return STD_LOGIC_VECTOR is
  begin
    return to_slv (arg);
  end function to_Std_Logic_Vector;
  function to_StdULogicVector (
    arg : ufixed)                       -- fp vector
    return STD_ULOGIC_VECTOR is
  begin
    return to_sulv (arg);
  end function to_StdULogicVector;
  function to_Std_ULogic_Vector (
    arg : ufixed)                       -- fp vector
    return STD_ULOGIC_VECTOR is
  begin
    return to_sulv (arg);
  end function to_Std_ULogic_Vector;
  function to_StdULogicVector (
    arg : sfixed)                       -- fp vector
    return STD_ULOGIC_VECTOR is
  begin
    return to_sulv (arg);
  end function to_StdULogicVector;
  function to_Std_ULogic_Vector (
    arg : sfixed)                       -- fp vector
    return STD_ULOGIC_VECTOR is
  begin
    return to_sulv (arg);
  end function to_Std_ULogic_Vector;
end package body fixed_pkg;


